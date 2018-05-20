const express = require('express');
const refreshToken = require('../middlewares/refreshToken.js');
const request = require('request');
const logger = require('../../build/lib/logger')
const url = require('url')
const kue = require('../kue.js');
const admin = require('firebase-admin');

module.exports = {
	registerRouter() {
		const router = express.Router();
		router.post('/user-playlist', (req, res) => {
			if(req.body == null) res.sendStatus(400)
			const {access_token,refresh_token,user,name}= req.body;
			const headers = {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+access_token
			};

			var options = {
				url: `https://api.spotify.com/v1/users/${user}/playlists?limit=20`,
				headers: headers
			};

			request(options, async (error, response, body) => {
				try { 
					let msg = JSON.parse(body)
					if (!msg.error) {
						res.json(msg);
					} else {
						logger.error(msg.error.message)
						refreshToken(refresh_token,name,false)
							.then( res => logger.info(res))
							.catch( e=>{ logger.error(e) });
						res.json({msg :msg.error.message})
					}
				}catch (e){
					refreshToken(refresh_token,name,false)
						.then( res => logger.info(res))
						.catch( e=>{ logger.error(e) });
					res.json({msg :e.msg})
				}
			})
		})

		router.post('/submit-playlist', (req, res) => {
			if(req.body == null) res.sendStatus(400)
			const {refresh_token, user, access_token ,name, id, submitedBy, projectname, device}= req.body;
			const headers = {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+access_token
			};
			var options = {
				url: `https://api.spotify.com/v1/users/${user}/playlists/${id}/tracks`,
				headers: headers
			};
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
			const jobs = kue.createQueue(kueOptions);

			const project = {
				name: projectname,
				votedUpBy: '',
				votedDownBy: '',
				votes: 0,
				submitedBy,
				author: user
			}

			request(options, (error, response, body) => {
				try { 
					let msg = JSON.parse(body)
					if (!msg.error) {
						msg.items.forEach( item =>{
							const song = item.track;
							song.project = project;
							logger.info("Adding ",song.name," To ",song.project.name)
							const songJob = jobs.create(song.project.name,{
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
						res.sendStatus(204);
					} else {
						logger.error(msg.error.message)
						refreshToken(refresh_token,name,false)
							.then( res => logger.info(res))
							.catch( e=>{ logger.error(e) });
						res.json(msg.error.message)
					}
				}catch (e){
					logger.error(e.message)
					refreshToken(refresh_token,name,false)
						.then( res => logger.info(res))
						.catch( e=>{ logger.error(e) });
					res.json(e.msg)
				}
			})
		})
		return router;
		}
}
