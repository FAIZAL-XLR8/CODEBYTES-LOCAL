const { createClient } = require("redis");
require("dotenv").config();

const redisOptions = {
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
};

if (process.env.REDIS_KEY) {
  redisOptions.password = process.env.REDIS_KEY;
  redisOptions.username = process.env.REDIS_USERNAME || "default";
}

const redisClient = createClient(redisOptions);

redisClient.on("error", (err) => console.error("Redis Client Error", err));

module.exports = redisClient;
