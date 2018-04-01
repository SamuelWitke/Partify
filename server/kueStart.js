const redis = require('kue/node_modules/redis');
const kue = require('kue');
const url = require('url')

kue.redis.createClient = function() {
    var redisUrl = url.parse(process.env.REDISTOGO_URL)
      , client = redis.createClient(redisUrl.port, redisUrl.hostname);
    if (redisUrl.auth) {
        client.auth(redisUrl.auth.split(":")[1]);
    }
    return client;
};

module.exports = kue;
