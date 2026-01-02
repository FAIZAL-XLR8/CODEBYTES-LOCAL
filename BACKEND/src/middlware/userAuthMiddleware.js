const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const userCollection = require("../Schemas/userSchema");

const tokenVerify = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error ("token not present!")
    const payload = jwt.verify(token, process.env.JWT_KEY);
    // JWT verify also verifies the token and decode doesnt verifies
    //payload ke andr hota hai exp time of token is liye jwt.decode user kiya gya hai
    const { _id, emailID } = payload;
    if (!_id) {
      throw new Error("ID missing");
    }
    if (!emailID) {
      throw new Error("EMail is missing");
    }
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) throw new Error("Invalid token!");
    const user = await userCollection.findById(_id);
    // thus we have user in req to use in next middlewares or controllers
    req.user = user; //easier to access user after authentication
    next();
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = tokenVerify;
