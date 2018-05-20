const Spotify = require('spotify-web-api-node');
const STATE_KEY = 'spotify_auth_state';
const CLIENT_ID = process.env.SPOTIFYCLIENT;
const CLIENT_SECRET = process.env.SPOTIFYSECRET;
const REDIRECT_URI = process.env.redirect_uri || 'http://localhost:3000/callback';
const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state' ,'user-read-currently-playing','user-modify-playback-state', 'streaming'];

// configure spotify
const spotifyApi = new Spotify({
	clientId: process.env.SPOTIFYCLIENT,
	clientSecret: process.env.SPOTIFYSECRET,
	redirectUri: REDIRECT_URI
});
/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);

/**
 * The /login endpoint
 * Redirect the client to the spotify authorize url, but first set that user's
 * state in the cookie.
 */
const express = require('express');
module.exports = {
	registerRouter() {
		const router = express.Router();
		router.get('/login', (_, res) => {
			const state = generateRandomString(16);
			res.cookie(STATE_KEY, state);
			res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
			});
		/**
		 * The /callback endpoint - hit after the user logs in to spotifyApi
		 * Verify that the state we put in the cookie matches the state in the query
		 * parameter. Then, if all is good, redirect the user to the user page. If all
		 * is not good, redirect the user to an error page
		 */
		router.get('/callback', (req, res) => {
			const { code, state } = req.query;
			const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
			if (state === null || state !== storedState) {
				res.redirect('/#/error/state mismatch');
				} else {
					res.clearCookie(STATE_KEY);
					spotifyApi.authorizationCodeGrant(code).then(data => {
						const { expires_in, access_token, refresh_token } = data.body;

						spotifyApi.setAccessToken(access_token);
						spotifyApi.setRefreshToken(refresh_token);

						tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];
						logger.info('Retrieved token. It expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');

						spotifyApi.getMe().then(({ body }) => {
							const data = { 
								'accessToken' : access_token, 
								'refreshToken' : refresh_token,
								'me' : body
								}
							res.cookie('spotify',data);
							res.redirect('/#/signup');
							});

						}).catch(err => {
							res.redirect('/#/error/invalid token');
							});
					}
			});
		return router;
		}
}
