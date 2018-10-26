const logger = require('../../build/lib/logger')
const request = require('request');
const admin = require('firebase-admin');

const refreshToken = (refresh_token,name,device) => {
    return new Promise((resolve, reject) =>  {
        logger.info("Requesting refresh_token",name)
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFYCLIENT+ ':' + process.env.SPOTIFYSECRET).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };
        request.post(authOptions, async (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token;
                logger.info("New token for user",name)
                if( device )
                    await admin.database().ref(`/users/${name}/accessToken`).set(access_token);
                else 
                    await admin.database().ref(`/projects/${name}/access_token`).set(access_token)
                resolve("Request Completed!");
            }else{
                logger.error("Error in request post",error,JSON.stringify(response), JSON.stringify(body))
                reject()
            }
        });
    })
};

module.exports = refreshToken;
