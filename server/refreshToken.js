const logger = require('../build/lib/logger')
const request = require('request');
const admin = require('firebase-admin');
const refreshToken = (refresh_token,name) => {
    logger.info("Requesting refresh_token",refresh_token,name)
    // requesting access token from refresh token
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFYCLIENT+ ':' + process.env.SPOTIFYSECRET).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            logger.success('Request Completed',name)
            admin.database().ref(`/projects/${name}/access_token`).set(access_token)
        }
    });
};

module.exports = refreshToken;
