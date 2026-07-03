const express = require("express");
const tokenVerify = require("../middlware/userAuthMiddleware");
const { getComments, addComment, getUserStats } = require("../controllers/discussionController");

const discussionRoute = express.Router();

discussionRoute.get("/:problemId", getComments);
discussionRoute.post("/comment", tokenVerify, addComment);
discussionRoute.get("/user-stats/:userId", getUserStats);

module.exports = discussionRoute;
