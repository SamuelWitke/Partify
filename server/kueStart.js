const url = require('url')
const kue = require('kue')
var kueOptions = {};
var jobs = kue.createQueue(kueOptions);

if(process.env.REDISCLOUD_URL) {
    var redisUrl = url.parse(process.env.REDISCLOUD_URL);
    kueOptions.redis = {
       port: parseInt(redisUrl.port),
       host: redisUrl.hostname
    };
    if(redisUrl.auth) {
       kueOptions.redis.auth = redisUrl.auth.split(':')[1];
    }
}

module.exports = jobs;
