const express = require('express')
const path = require('path')
const webpack = require('webpack')
const logger = require('../build/lib/logger')
const webpackConfig = require('../build/webpack.config')
const project = require('../project.config')
const compress = require('compression')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express()
const admin = require('firebase-admin');
const compiler = webpack(webpackConfig)


const kue = require('./kueStart.js')

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)


if (project.env === 'development') {
    const dotenv = require('dotenv');
    const result = dotenv.config();
    dotenv.load();
    //const kueUiExpress = require('kue-ui-express');
    //kueUiExpress(app, '/kue/', '/kue-api/');
    //app.use('/kue-api/', kue.app);
    //kue.createQueue();
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

admin.initializeApp({
    credential: admin.credential.cert(info.firebase),
    databaseURL: "https://partypeople-b736d.firebaseio.com"
});

admin.database().ref('/projects').on("child_added", function(snapshot) {
    var newPost = snapshot.val();
    let ref = admin.database().ref(`/projects/${newPost.name}/Songs`)
    ref.on("child_changed", function(snapshot) {
        let song = snapshot.val()
        kue.Job.get( song.song.song_id, function( err, job ) {
            job.priority(-song.song.project.votes).update(() => {
                logger.info("Changed",song.song.project.votes,song.song.song_id,song.song.name,job.data.title);
            })
        });
    })
    ref.on("child_removed", function(snapshot) {
        console.log('Child '+snapshot.val()+' was removed');
        let song = snapshot.val()
        kue.Job.get( song.song.song_id, function( err, job ) {
            job.remove();
            logger.info("Song",song.song.name,"removed")
        })
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
