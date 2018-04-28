const request = require('request');
const admin = require('firebase-admin');
const logger = require('../build/lib/logger')

module.exports = function player(job,done,_exitActivJob) {
    return new Promise((resolve, reject) => {
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

        request(options, async (error, response, body) => {
            if (!error) {
                logger.info("Playing",job.data.title);
                await admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}/song/active`).set(true)
                //Store the job's done function in a global variable so we can access it from elsewhere.
                _exitActivJob = () => {
                    resolve("Song Deleted");
                    done();
                };

                setTimeout( async () => {
                    let del_ref = admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}`);
                    try{
                        await del_ref.remove()
                        logger.info('song removed');
                    }catch( error ){
                        console.log('Error deleting data:', error);
                    };
                    done();
                    resolve("Song Finished");
                }, job.data.time);
            } else {
                logger.error(error.message) 
                done();
                reject();
            }
        })
    })
}

