const express = require('express');
const url = require('url')
const kue = require('../kue.js');
const logger = require('../../build/lib/logger')
const admin = require('firebase-admin');

module.exports = {
	registerRouter() {
		const router = express.Router();
		router.post('/', (req, res) => {
			if(req.body == null) res.sendStatus(400)
			const {songs,device,refresh_token,name}= req.body;
			let redisUrl = url.parse(process.env.REDISCLOUD_URL||"redis://localhost:6379");
			const kueOptions = {};
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

			songs.forEach( song => {
				logger.info("Adding ",song.name," To ",song.project.name)
				var songJob = jobs.create(song.project.name,{
					title: song.name,
					project: song.project.name,
					time: song.duration_ms,
					uri: song.uri,
					refresh_token: refresh_token,
					device: device,
					key: admin.database().ref(`projects/${song.project.name}/Songs`).push({song}).key,
					})
				.priority(song.project.votes)
				.save( err => {
					if(err) { 
						logger.error(err.msg); 
						res.json(err.msg)
						} else {
							song.song_id = songJob.id;
							admin.database().ref(`projects/${song.project.name}/Songs/${songJob.data.key}/song/song_id`).set(songJob.id)
							}
					})
				});
			res.sendStatus(204)
			});
			return router;
		}
}
