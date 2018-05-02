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
const compiler = webpack(webpackConfig)
const url = require('url')
const  kue = require('./kue.js');

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
    //// Keep Heroku Alive
}
if( process.env.NODE_ENV === 'production' ){
    // Keep Heroku From Idling
    const http = require("http");
    setInterval(function() {
        http.get("http://partifystart.herokuapp.com");
    }, 300000); // every 5 minutes (300000) 
}

const routes = require('./routes');
const admin = require('./player.js');

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
