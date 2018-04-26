const Spotify = require('spotify-web-api-node');
const querystring = require('querystring');
const express = require('express');
const router = new express.Router();
const logger = require('../build/lib/logger')
const admin = require('firebase-admin');
const request = require('request');
const refreshToken = require('./refreshToken.js')

const jobs = require('./kue.js');


// configure the express server
const CLIENT_ID = process.env.SPOTIFYCLIENT;
const CLIENT_SECRET = process.env.SPOTIFYSECRET;
const REDIRECT_URI = process.env.redirect_uri || 'http://localhost:3000/callback';
const STATE_KEY = 'spotify_auth_state';
// your application requests authorization
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
	// first do state validation
	if (state === null || state !== storedState) {
		res.redirect('/#/error/state mismatch');
		// if the state is valid, get the authorization code and pass it on to the client
		} else {
			res.clearCookie(STATE_KEY);
			// Retrieve an access token and a refresh token
			spotifyApi.authorizationCodeGrant(code).then(data => {
				const { expires_in, access_token, refresh_token } = data.body;

				// Set the access token on the API object to use it in later calls
				spotifyApi.setAccessToken(access_token);
				spotifyApi.setRefreshToken(refresh_token);

				// use the access token to access the Spotify Web API
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

				// we can also pass the token to the browser to make requests from there
				//
				//res.redirect(`/#/callback/${access_token}/${refresh_token}`);
				}).catch(err => {
					res.redirect('/#/error/invalid token');
					});
			}
});

router.post('/devices', (req,res) => {
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
					authOptions = {
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
							var access_token = body.access_token;
							try{
									const snap = await admin.database().ref(`/users/${name}/accessToken`).set(access_token);
									logger.success('Request Completed',snap.val())
									res.sendStatus(204)
								}catch(e){
									console.log(e, e.message);
								}
							}
						});
					}else 
					res.json( {msg : "no devices"});
			});
		}else
		res.json({msg : "access_token undefined"});
});

router.post('/search', (req, res, next) => {
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
	request(options, async (error, response, body) => {
		try { 
			let msg = JSON.parse(body)
			if (!msg.error) {
				res.json(msg);
				}else {
					logger.error(msg.error.message)
					if(msg.error.message === 'The access token expired'){
						refreshToken(refresh_token,name);
						}
					res.send(msg.error.message)
					}
			}catch (e){
				res.json(e.msg)
				}
		})
});

router.post('/song-queue', (req, res) => {
	if(req.body == null) res.sendStatus(400)
	const {songs,access_token,device,refresh_token,name}= req.body;
	let song = songs[0];
	let key = undefined;
	songs.forEach( song => {
		var songJob = jobs.create( 'song', {
			title: song.name,
			project: song.project.name,
			time: song.duration_ms,
			uri: song.uri,
			access_token: access_token,
			refresh_token: refresh_token,
			device: device,
			key: admin.database().ref(`projects/${song.project.name}/Songs`).push({song}).key,
			})
		.priority(song.project.votes)
		.save( err =>{
			if(err){
				logger.error(err.msg);
				res.json(err.msg)
				}else {
					song.song_id = songJob.id;
					admin.database().ref(`projects/${song.project.name}/Songs/${songJob.data.key}/song/song_id`).set(songJob.id)
					}
			})
	});
});

module.exports = router;
