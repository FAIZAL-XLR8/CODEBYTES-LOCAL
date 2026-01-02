const express = require("express");
const chatWithAI = require ("../controllers/aichat")

const aiRouter = express.Router();
aiRouter.post("/chat", chatWithAI);

module.exports = aiRouter;
