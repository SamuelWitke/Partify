const logger = require('../build/lib/logger')
const request = require('request');
const url = require('url')
const admin = require('firebase-admin');
const kue = require('kue')
const redis = require('redis');

let redisUrl = url.parse(process.env.REDISCLOUD_URL||"redis://localhost:6379");
let redisClient = redis.createClient(parseInt(redisUrl.port), redisUrl.hostname);

if(redisUrl.auth)
    redisClient.auth(redisUrl.auth.split(':')[1]);

kue.redis.createClient = function () {
    return redisClient;
};

module.exports = kue;

