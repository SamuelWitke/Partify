const kue = require('kue');
const url = require('url')
const redis = require('kue/node_modules/redis');

redis.createClient(
    process.env.redisPort || "6379",
    process.env.redisHost || "127.0.0.1",
    {
        'auth_pass': process.env.redisKey,
        'return_buffers': true
    })

module.exports = kue;
