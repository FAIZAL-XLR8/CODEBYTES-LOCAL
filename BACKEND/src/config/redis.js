const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_KEY,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

module.exports = redisClient;
