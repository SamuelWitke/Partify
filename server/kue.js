const logger = require('../build/lib/logger')
const request = require('request');
const url = require('url')
const admin = require('firebase-admin');
const kue = require('kue')
const kueOptions = {};
const redis = require('redis');

let redisUrl = url.parse(process.env.REDISCLOUD_URL||"redis://localhost:6379");
let redisClient = redis.createClient(parseInt(redisUrl.port), redisUrl.hostname);

if(redisUrl.auth)
    redisClient.auth(redisUrl.auth.split(':')[1]);

kue.redis.createClient = function () {
    return redisClient;
};


/*
if(process.env.REDISCLOUD_URL) {
    kueOptions.redis = {
       port: parseInt(redisUrl.port),
       host: redisUrl.hostname
    };
    if(redisUrl.auth) {
       kueOptions.redis.auth = redisUrl.auth.split(':')[1];
    }
}
const jobs = kue.createQueue(kueOptions);
*/
const jobs = kue.createQueue();


module.exports = {jobs,kue};

