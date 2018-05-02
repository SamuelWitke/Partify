const info = require('../.auth.js');
const admin = require('firebase-admin');
const url = require('url')
const  kue = require('./kue.js');
const logger = require('../build/lib/logger')
const request = require('request-promise');

admin.initializeApp({
    credential: admin.credential.cert(info.firebase),
    databaseURL: "https://partypeople-b736d.firebaseio.com"
});

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


let _exitActivJob;
let timeOutPlayer = {player: undefined};

admin.database().ref('/kues').on("child_added", (snapshot) => {
    const projects = snapshot.val();
    const jobs = kue.createQueue(kueOptions);
    logger.info(projects)
    jobs.process(projects,1, async ( job, done ) => {
        const access_ref = await admin.database().ref(`projects/${job.data.project}/access_token`).once('value');
        await admin.database().ref(`projects/${job.data.project}/active/`).set(job.data.uri)

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

        const song_ref = admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}`);

        const songSnap = await song_ref.once('value');
        const active = songSnap.exists();
        if(active){
            request(options)
                .then( async (response) => {
                    logger.info("Playing",job.data.title);
                    timeOutPlayer.player = setTimeout( async () => {
                        const del_ref = admin.database().ref(`projects/${job.data.project}/Songs/${job.data.key}`);
                        try{
                            await del_ref.remove()
                            logger.info('song removed'+job.data.title);
                        }catch( error ){
                            console.log('Error deleting data:', error);
                        };
                        done();
                    }, job.data.time)
                }).catch( async e => {
                    logger.error(e) 
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
                    clearTimeout(timeOutPlayer.player);
                })
        }
        done();
    })
})

admin.database().ref('/kues').on("child_added", function(snapshot) {
    const projects = snapshot.val();
    let ref = admin.database().ref(`/projects/${projects}/Songs`)
    ref.on("child_changed", (snapshot) => {
        try{
            let song = snapshot.val()
            if(song){
                kue.Job.get( song.song.song_id, ( err, job ) => {
                    try{
                        job.priority(-song.song.project.votes).update(() => {
                            if(!err){
                                logger.info("Changed",song.song.project.votes,song.song.song_id,song.song.name,job.data.title);
                            }else{
                                throw Error('Kue Priority Error')
                            }
                        })
                    }catch(e){logger.error(e.message)}
                });
            }throw Error('Song Not Found')
        }catch(e){logger.error(e.message)}
    })
    ref.on("child_removed", async (snapshot) => {
        let song = snapshot.val()
        let ref = admin.database().ref(`/projects/${projects}/active`);
        const snapshotActive = await ref.once('value');
        const active = snapshotActive.val();
        try{
            kue.Job.get(song.song.song_id, ( err, job ) => {
                if(!err){
                    try{
                        if(job.state('active') && song.song.uri === active && _exitActivJob && timeOutPlayer.player){
                            _exitActivJob();
                            _exitActivJob = undefined;
                            clearTimeout(timeOutPlayer.player);
                            timeOutPlayer.player = undefined;
                        }
                        logger.info("Song",song.song.name,"removed",song.song.song_id)
                        job.remove();
                    }catch(e){logger.error(e.message)}
                }throw new Error('Kue Removal Error')
            })
        }catch(e){logger.error(e.message)}
    })
});

module.exports = admin;
