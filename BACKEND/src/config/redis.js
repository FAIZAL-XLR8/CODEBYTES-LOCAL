const { createClient } = require("redis");
require("dotenv").config();
const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_KEY,
  socket: {
    host: "redis-14185.c256.us-east-1-2.ec2.cloud.redislabs.com",
    port: 14185,
  },
});
module.exports = redisClient;
