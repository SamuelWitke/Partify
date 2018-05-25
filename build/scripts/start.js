const logger = require('../lib/logger')
//const ip = require('ip');
logger.info('Starting server...')
const fs = require('fs');
const PORT = process.env.PORT || 3000; 
const HOST = process.env.HOST || 'localhost';
const app = require('../../server/main');
const https = require('https');
const path = require('path');

// Https
const credentials = {
    cert: fs.readFileSync(path.join(__dirname,'sslcert','server.crt'),'utf8'),
    key: fs.readFileSync(path.join(__dirname,'sslcert','server.key'),'utf8'),
};

console.log(credentials)

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  logger.success('https is running at ',HOST,PORT)
}).on('error', error => {
    logger.error(error.message)
	throw new Error('HTTPS server error');
});;
