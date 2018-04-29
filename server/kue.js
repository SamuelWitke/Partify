const kue = require('kue')
const redis = require('redis');
const url = require('url')
const redisUrl = url.parse(process.env.REDISCLOUD_URL||"redis://localhost:6379");
const redisClient = redis.createClient(parseInt(redisUrl.port), redisUrl.hostname);

if(redisUrl.auth)
    redisClient.auth(redisUrl.auth.split(':')[1]);

kue.redis.createClient = function () {
    return redisClient;
};

module.exports = kue;
