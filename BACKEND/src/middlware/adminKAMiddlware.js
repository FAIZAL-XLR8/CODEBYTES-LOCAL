const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const userCollection = require("../Schemas/userSchema");

const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.verify(token, process.env.JWT_KEY);
    if (payload.role != "admin") {
      throw new Error("Admin authorisation failed!");
    }
    //payload ke andr hota hai exp time of token is liye jwt.decode user kiya gya hai
    const { _id, emailID } = payload;
    if (!_id) {
      throw new Error("ID missing");
    }
    if (!emailID) {
      throw new Error("Email is missing");
    }
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) throw new Error("Invalid token!");
    const user = await userCollection.findById(_id);
    req.user = user;
    next();
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = adminMiddleware;
