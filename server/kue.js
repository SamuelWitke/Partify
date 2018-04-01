const kue = require('./kueStart.js') 
const logger = require('../build/lib/logger')

var kueOptions = {};

if(process.env.REDISTOGO_URL) {
    var redisUrl = url.parse(process.env.REDISTOGO_URL);
    kueOptions.redis = {
        port: parseInt(redisUrl.port),
        host: redisUrl.hostname
    };
    if(redisUrl.auth) {
        kueOptions.redis.auth = redisUrl.auth.split(':')[1];
    }
}

var jobs = kue.createQueue(kueOptions);
const request = require('request');
const refreshToken = require('./refreshToken.js')
var querystring = require('querystring');

jobs.process( 'song', 1, function ( job, done ) {
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
        console.log(body)
        if (!error) {
            logger.info("Playing",job.data.title)
            setTimeout( function () {
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
} );

module.exports = jobs;

