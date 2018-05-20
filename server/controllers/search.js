const express = require('express');
const logger = require('../../build/lib/logger')
const request = require('request');
const refreshToken = require('../middlewares/refreshToken.js');

module.exports = {
	registerRouter() {
		const router = express.Router();
		router.post('/', (req, res, next) => {
			const {search,access_token,refresh_token,name}= req.body;
			logger.info("Searching for "+search)
			const headers = {
				'Accept': 'application/json',
				'Authorization': 'Bearer '+access_token
			};
			const options = {
				url: `https://api.spotify.com/v1/search?q=${search}&type=track`,
				headers: headers
			};
			request(options, (error, response, body) => {
				try { 
					let msg = JSON.parse(body)
					if (!msg.error) {
						res.json(msg);
					} else {
						logger.error(msg.error.message)
						refreshToken(refresh_token,name,false)
							.then( res => logger.info(res))
							.catch( e=>{ logger.error(e) });
						res.json(msg.error.message)
					}
				}catch (e){
					refreshToken(refresh_token,name,false)
						.then( res => logger.info(res))
						.catch( e=>{ logger.error(e) });
					res.json(e.msg)
				}
			})
		});
		return router;
	}
}
