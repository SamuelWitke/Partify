const logger = require('../build/lib/logger')
const url = require('url')
const admin = require('firebase-admin');

var jobs = require('./kueStart.js');

const request = require('request');
const refreshToken = require('./refreshToken.js')
var querystring = require('querystring');

/* Only one worker for free redislabs */
jobs.process('song',1, function ( job, done ) {
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
    
} );

//Store the job's done function in a global variable so we can access it from elsewhere.


module.exports = jobs;

