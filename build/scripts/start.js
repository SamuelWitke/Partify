/*
const logger = require('../lib/logger')
const path = require('path');
const fs = require('fs'),
 			https = require('https'),
  		express = require('express'),
			httpApp = express(),
			http = require('http'); 

const PORT = process.env.PORT || 3000; 
logger.info('Starting server...')

httpApp.get("*", function (req, res, next) {
		if( process.env.NODE_ENV === 'production' ){
    	res.redirect("https://" +"partifystart.herokuapp.com"+req.path);
		}else{
    	res.redirect("https://" +"localhost:"+PORT+req.path);
		}
});

var sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname,'sslcert','localhost.key')),
  cert: fs.readFileSync(path.resolve(__dirname,'sslcert','localhost.crt')),
  ca: fs.readFileSync(path.resolve(__dirname,'sslcert','localhost_CA.pem'))
};

const app =require('../../server/main');

http.createServer(httpApp).listen(3080, function(){
  console.log("HTTP Express server listening localhost on port "+3080);
});

https.createServer(sslOptions, app).listen(PORT, function(){
  console.log("HTTPS Express server listening localhost on port "+PORT);
});
	*/
const logger = require('../lib/logger')
//const ip = require('ip');

logger.info('Starting server...')

const PORT = process.env.PORT || 3000; 
require('../../server/main').listen(PORT, () => {
  logger.success('Server is running at ',PORT)
	})
