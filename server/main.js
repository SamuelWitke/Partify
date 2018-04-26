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

const {jobs, kue} = require('./kue.js');



// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

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

    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests). If you want to implement universal
    // rendering, you'll want to remove this middleware.

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
const jobs = require('./kue.js');
const request = require('request');

admin.initializeApp({
    credential: admin.credential.cert(info.firebase),
    databaseURL: "https://partypeople-b736d.firebaseio.com"
});

admin.database().ref('/projects').on("child_added", function(snapshot) {
    var project = snapshot.val();
		jobs.process(project.name,1, ( job, done ) =>{
        let access_token = `${job.data.access_token}`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+access_token,
        };

        var dataString = `{"uris":["${job.data.uri}"]}`;
        var device = job.data.device;
        var options = {
            url: `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
            method: 'PUT',
            headers: headers,
            body:  dataString
        };
        function callback(error, response, body) {
            if (!error) {
                logger.info("Playing",job.data.title);
                admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}/song/active`).set(true)
                setTimeout( function () {
                    let del_ref = admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}`);
                    del_ref.remove()
                        .then(function() {
                            logger.info('song removed');
                        })
                        .catch(function(error) {
                            console.log('Error deleting data:', error);
                        });
                    done();
                res.sendStatus(200);
                }, job.data.time);
            }else {
                logger.error(msg.error.message)
                if(msg.error.message === 'The access token expired'){
                    refreshToken(refresh_token,name);
                }
            }

        }
        request(options, callback);	
        //Store the job's done function in a global variable so we can access it from elsewhere.
        _exitActivJob = function() {
            done();
        };
    } );

	/*
    let ref = admin.database().ref(`/projects/${newPost.name}/Songs`)

    jobs.process(newPost.name,1, function ( job, done ) {
            let access_token = `${job.data.access_token}`
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+access_token,
            };

            var dataString = `{"uris":["${job.data.uri}"]}`;
            var device = job.data.device;
            var options = {
                url: `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
                method: 'PUT',
                headers: headers,
                body:  dataString
            };
            function callback(error, response, body) {
                if (!error) {
                    logger.info("Playing",job.data.title);
                    admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}/song/active`).set(true)
                    setTimeout( function () {
                        let del_ref = admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}`);
                        del_ref.remove()
                            .then(function() {
                                logger.info('song removed');
                            })
                            .catch(function(error) {
                                console.log('Error deleting data:', error);
                            });
                        done();
                    }, job.data.time);
                }else {
                    logger.error(msg.error.message)
                    if(msg.error.message === 'The access token expired'){
                        refreshToken(refresh_token,name);
                    }
                }

            }
            request(options, callback);	
            //Store the job's done function in a global variable so we can access it from elsewhere.
            _exitActivJob = function() {
                done();
            };
        } );

    ref.on("child_changed", function(snapshot) {
        let song = snapshot.val()
        kue.Job.get( song.song.song_id, function( err, job ) {
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
    })
    ref.on("child_removed", function(snapshot) {
        let song = snapshot.val()
        logger.info("Song",song.song.name,"removed",song.song.song_id)
        try{
            kue.Job.get(song.song.song_id, function( err, job ) {
                if(!err){
                    try{
                    job.state('active');
                    job.remove();
                    logger.info("Song",song.song.name,"removed")
                    }catch(e){
                      logger.error(e.message)
                    }
            }
        })
        }catch(e){
            logger.error(e.message)
        }
    })
		*/
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
