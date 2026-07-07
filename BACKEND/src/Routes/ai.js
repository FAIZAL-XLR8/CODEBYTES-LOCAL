const express = require("express");
const { chatWithAI, analyzeCodeWithAI, getNextLinesSuggestion, studyAssistantChat } = require ("../controllers/aichat")

const aiRouter = express.Router();
aiRouter.post("/chat", chatWithAI);
aiRouter.post("/analyze", analyzeCodeWithAI);
aiRouter.post("/suggest", getNextLinesSuggestion);
aiRouter.post("/study-assistant", studyAssistantChat);

module.exports = aiRouter;
