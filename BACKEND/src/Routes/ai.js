const express = require("express");
const { chatWithAI, analyzeCodeWithAI, getNextLinesSuggestion } = require ("../controllers/aichat")

const aiRouter = express.Router();
aiRouter.post("/chat", chatWithAI);
aiRouter.post("/analyze", analyzeCodeWithAI);
aiRouter.post("/suggest", getNextLinesSuggestion);

module.exports = aiRouter;
