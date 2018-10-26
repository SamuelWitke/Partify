const express = require('express');
const request = require('request');
const refreshToken = require('../middlewares/refreshToken.js');
const logger = require('../../build/lib/logger')

module.exports = {
	registerRouter() {
		const router = express.Router();
		router.post('/', (req,res) => {
			const {access_token,name,refresh_token} = req.body;
			if(access_token) {
				var devices = []
				var options = {
					url: 'https://api.spotify.com/v1/me/player/devices',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
					};
				request.get(options, (error, response, body) => {
					if(body.error == null && body.devices.length > 0){
						body.devices.forEach( (device) => {
							devices.push({
								name: device.name,
								type: device.type,
								id: device.id,
								});
							});
						res.json({devices});
						}else if(body.error != undefined && body.error.message == 'The access token expired'){
							refreshToken(refresh_token,name,true)
							.then( res => logger.info(res))
							.catch( e=>{ logger.error("Error caught devices refreshToken",e) });
							res.json( {msg : body.error.message});
							}else{
								refreshToken(refresh_token,name,true)
								.then( res => logger.info(res))
								.catch( e=>{ logger.error(e) });
								res.json( {msg : "no devices"});
								}
					});
				}else
				res.json({msg : "access_token undefined"});
			});
		return router;
		}
}
