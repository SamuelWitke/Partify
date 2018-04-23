const logger = require('../build/lib/logger')
const url = require('url')
const admin = require('firebase-admin');
const kue = require('kue')
const kueOptions = {};

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
const jobs = kue.createQueue(kueOptions);

module.exports = jobs;

