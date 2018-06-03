const logger = require('../lib/logger')
const path = require('path');
const fs = require('fs'),
 			https = require('https'),
  		express = require('express');

logger.info('Starting server...')

var sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname,'sslcert','localhost.key')),
  cert: fs.readFileSync(path.resolve(__dirname,'sslcert','localhost.crt')),
  ca: fs.readFileSync(path.resolve(__dirname,'sslcert','localhost_CA.pem'))
};

const PORT = process.env.PORT || 3000; 
const app =require('../../server/main');

https.createServer(sslOptions, app).listen(PORT, function(){
  console.log("HTTPS Express server listening localhost on port "+PORT);
});
