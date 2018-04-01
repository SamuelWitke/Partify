const kue = require('kue');
const url = require('url')
const redis = require('kue/node_modules/redis');
const config = require("../.redis-labs.js")
const project = require('../project.config')
console.log(config)
let redisHost;
let redisPort;
let redisKey;
if (project.env === 'development') {
    redisPort='6379';
    redisHost='127.0.0.1';
}else{
    redisPort=config.Redis.redisPort;
    redisHost=config.Redis.redisHost;
    redisKey=config.Redis.redisKey;
}

kue.redis.createClient = () =>{
    return redis.createClient(
    redisPort,
    redisHost,
    {
    'auth_pass': redisKey,
    'return_buffers': true
    })
}

module.exports = kue;
