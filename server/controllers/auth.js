const Spotify = require('spotify-web-api-node');
const stateKey = 'spotify_auth_state';
const request = require('request');
const client_id = process.env.SPOTIFYCLIENT;
const client_secret = process.env.SPOTIFYSECRET;
const redirect_uri = process.env.redirect_uri || 'http://localhost:3000/auth/callback';
const querystring = require('querystring');
const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state' ,'user-read-currently-playing','user-modify-playback-state', 'streaming'];
/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);
const express = require('express');

module.exports = {
	registerRouter() {
		const router = express.Router();
		/**
			* The /login endpoint
 			* Redirect the client to the spotify authorize url, but first set that user's
 			* state in the cookie.
 		*/
		router.get('/oauth', (_, res) => {
			const state = generateRandomString(16);
			res.cookie(stateKey, state);
			// your application requests authorization
			res.redirect('https://accounts.spotify.com/authorize?' +
				querystring.stringify({
					response_type: 'code',
					client_id,
					scope: scopes.toString(),
					redirect_uri,
					state 
				}));
		});

		/**
		 * The /callback endpoint - hit after the user logs in to spotifyApi
		 * Verify that the state we put in the cookie matches the state in the query
		 * parameter. Then, if all is good, redirect the user to the user page. If all
		 * is not good, redirect the user to an error page
		 */
		router.get('/callback', (req, res) => {
			// your application requests refresh and access tokens
			// after checking the state parameter
			const code = req.query.code || null;
			const state = req.query.state || null;
			const storedState = req.cookies ? req.cookies[stateKey] : null;
			if (state === null || state !== storedState) {
				res.redirect('/#/error/statemismatch');
			} else {
				var authOptions = {
					url: 'https://accounts.spotify.com/api/token',
					form: {
						code,
						redirect_uri,
						grant_type: 'authorization_code'
					},
					headers: {
						'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
					},
					json: true
				};
				request.post(authOptions, function(error, response, body) {
					if (!error && response.statusCode === 200) {
						const access_token = body.access_token,
							refresh_token = body.refresh_token;
						const options = {
							url: 'https://api.spotify.com/v1/me',
							headers: { 'Authorization': 'Bearer ' + access_token },
							json: true
						};
						// use the access token to access the Spotify Web API
						request.get(options, function(error, response, body) {
							const data = { 
								'accessToken' : access_token, 
								'refreshToken' : refresh_token,
								'me' : body
							}
							res.cookie('spotify',data);
							res.redirect('/#/signup');
						});
						}else{
							res.redirect('/#/error/statemismatch');
						}
					});
			};
			res.clearCookie(stateKey);
		})
		router.post('/refresh_token', (req, res, next) => {
			const  refresh_token  = req.cookies ? req.cookies['spotify'] : null;
      const request = (refresh_token) => {
			return new Promise((resolve, reject) =>  {
        logger.info("Requesting refresh_token")
        const authOptions = {
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
								/*
                if( device )
                    await admin.database().ref(`/users/${name}/accessToken`).set(access_token);
                else 
                    await admin.database().ref(`/projects/${name}/access_token`).set(access_token)
										*/
                resolve(accessToken);
            }else{
                reject()
            }
        });
			})
    }
		request( refresh_token )
			.then( access_token => {
					const data = { 
								'accessToken' : access_token, 
								'refreshToken' : refresh_token,
						}
				res.cookie('spotify',data);
				})
			.catch( err => {
				res.sendStatus(400);
			});
		})
		return router;
	}
}
