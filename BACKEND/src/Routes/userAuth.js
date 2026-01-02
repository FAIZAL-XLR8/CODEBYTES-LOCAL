const express = require("express");
const authRoute = express.Router();
const userCollection = require("../Schemas/userSchema");
const tokenVerify = require("../middlware/userAuthMiddleware");
const adminMiddleware = require("../middlware/adminKAMiddlware");
const userAuthMiddleware = require("../middlware/userAuthMiddleware");
const {
  register,
  login,
  logout,
  getProfile,
  adminRegister,
  deleteProfile,
} = require("../controllers/userAuthenticate");
authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/logout", tokenVerify, logout);
authRoute.delete("/profile", userAuthMiddleware, deleteProfile);
authRoute.get("/getProfile", tokenVerify, getProfile);
authRoute.post("/admin/register", adminMiddleware, adminRegister);
// user gets verified if it exists or not then if it does we send the reponse user is already present 
authRoute.get('/check', userAuthMiddleware, (req, res) => {
  const reply = {
    userName : req.user.firstName,
    emailId : req.user.emailID,
    _id : req.user._id,
    role : req.user.role,
  }
  res.status(200).json({
    user : reply,
    message : "user verified!"
  })
})

module.exports = authRoute;

