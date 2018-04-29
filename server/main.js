const express = require('express')
const project = require('../project.config')
if (project.env === 'development') {
    const dotenv = require('dotenv');
    const result = dotenv.config();
    dotenv.load();
}
const path = require('path')
const webpack = require('webpack')
const logger = require('../build/lib/logger')
const webpackConfig = require('../build/webpack.config')
const compress = require('compression')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express()
const admin = require('firebase-admin');
const compiler = webpack(webpackConfig)
const  kue = require('./kue.js');
const url = require('url')
const refreshToken = require('./refreshToken.js')
//const player = require('./player.js')

if (project.env === 'development') {

    const kueUiExpress = require('kue-ui-express');
    kueUiExpress(app, '/kue/', '/kue-api/');
    app.use('/kue-api/', kue.app);

    logger.info('Enabling webpack development and HMR middleware')
    app.use(
        require('webpack-dev-middleware')(compiler, {
            publicPath: webpackConfig.output.publicPath,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            contentBase: path.resolve(project.basePath, project.srcDir),
            hot: true,
            quiet: false,
            noInfo: false,
            lazy: false,
            stats: 'normal'
        })
    )
    app.use(
        require('webpack-hot-middleware')(compiler, {
            path: '/__webpack_hmr'
        })
    )

    // Serve static assets from ~/public since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    app.use(express.static(path.resolve(project.basePath, 'public')))


} else {
    logger.warn(
        'Server is being run outside of live development mode, meaning it will ' +
        'only serve the compiled application bundle in ~/dist. Generally you ' +
        'do not need an application server for this and can instead use a web ' +
        'server such as nginx to serve your static files. See the "deployment" ' +
        'section in the README for more information on deployment strategies.'
    )
    // NOTE: If you are using this, you should make express and compress dependencies instead of dev dependencies
    // Serving ~/dist by default. Ideally these files should be served by
    // the web server and not the app server, but this helps to demo the
    // server in production.
}

const info = require('../.auth.js');

admin.initializeApp({
    credential: admin.credential.cert(info.firebase),
    databaseURL: "https://partypeople-b736d.firebaseio.com"
});

const request = require('request');
let _exitActivJob;

const jobProcess = [];

admin.database().ref('/kues').on("child_added", function(snapshot) {
    const projects = snapshot.val();
    const kueOptions = {};
    let redisUrl = url.parse(process.env.REDISCLOUD_URL||"redis://localhost:6379");
    if(process.env.REDISCLOUD_URL) {
        kueOptions.redis = {
            port: parseInt(redisUrl.port),
            host: redisUrl.hostname
        };
        if(redisUrl.auth) {
            kueOptions.redis.auth = redisUrl.auth.split(':')[1];
        }
    }

    const jobs = kue.createQueue(kueOptions);
    if(jobProcess.indexOf(projects) === -1){
        jobProcess.push(projects)
        logger.info(projects)
        jobs.process(projects,1, async ( job, done ) => {
                const access_ref = await admin.database().ref(`projects/${job.data.project}/access_token`).once('value');
                const access_token = `${access_ref.val()}`
                const refresh_token = job.data.refresh_token;
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+access_token,
                };

                const dataString = `{"uris":["${job.data.uri}"]}`;
                const device = job.data.device;
                const options = {
                    url: `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
                    method: 'PUT',
                    headers: headers,
                    body:  dataString
                };
                //Store the job's done function in a global variable so we can access it from elsewhere.
                 _exitActivJob = () => {
                    done();
                };
                request(options, async (error, response, body) => {
                    if (body.indexOf('error') === -1) {
                        logger.info("Playing",job.data.title);
                        await admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}/song/active`).set(true)
                        setTimeout( async () => {
                            const del_ref = admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}`);
                            try{
                                await del_ref.remove()
                                logger.info('song removed');
                            }catch( error ){
                                console.log('Error deleting data:', error);
                            };
                            done();
                        }, job.data.time);
                    } else {
                        logger.error(body) 
                        try{  
                            const res = await refreshToken(refresh_token,job.data.project,false)
                            const del_ref = admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}`);
                            try{
                                await del_ref.remove()
                                logger.info('song removed');
                            }catch( error ){
                                console.log('Error deleting data:', error);
                            }
                            logger.info(res)
                        }catch(e){logger.error(e) };
                            done();
                    }
                })
            })
    }
})

admin.database().ref('/kues').once("child_added", function(snapshot) {
    const projects = snapshot.val();
    let ref = admin.database().ref(`/projects/${projects}/Songs`)
    ref.on("child_changed", (snapshot) => {
        let song = snapshot.val()
        if(song){
        kue.Job.get( song.song.song_id, ( err, job ) => {
            try{
                job.priority(-song.song.project.votes).update(() => {
                    if(!err){
                        logger.info("Changed",song.song.project.votes,song.song.song_id,song.song.name,job.data.title);
                    }
                })
            }catch(e){
                logger.error(e.message)
            }
        });
        }
    })
    ref.on("child_removed", function(snapshot) {
        let song = snapshot.val()
        try{
            kue.Job.get(song.song.song_id, function( err, job ) {
                if(!err){
                    try{
                        if(job.state('active') && song.song.active && _exitActivJob){
                            _exitActivJob();
                            _exitActivJob = undefined;
                        }
                        logger.info("Song",song.song.name,"removed",song.song.song_id)
                        job.remove();
                    }catch(e){
                        logger.error(e.message)
                    }
                }
            })
        } catch(e){logger.error(e.message)}
    })
});

const routes = require('./routes');
app.use(compress())
app.use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(express.static(path.resolve(project.basePath, project.outDir)))
    .use('/', routes);

app.use('*', function(req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
})

module.exports = app
