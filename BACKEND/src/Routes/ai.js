const express = require("express");
const { chatWithAI, analyzeCodeWithAI } = require ("../controllers/aichat")

const aiRouter = express.Router();
aiRouter.post("/chat", chatWithAI);
aiRouter.post("/analyze", analyzeCodeWithAI);

module.exports = aiRouter;
