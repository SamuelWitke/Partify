const kue = require('kue');
const url = require('url')
const redis = require('kue/node_modules/redis');
kue.redis.createClient = ()=> {
    console.log("here")
    const redisUrl = url.parse(process.env.REDISTOGO_URL)
      , client = redis.createClient(redisUrl.port, redisUrl.hostname);
    if (redisUrl.auth) {
        console.log('here')
        client.auth(redisUrl.auth.split(":")[1]);
    }
    return client;
};

module.exports = kue;
