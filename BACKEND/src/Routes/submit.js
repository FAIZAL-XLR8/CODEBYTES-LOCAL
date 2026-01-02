const express = require("express");
const submitRouter = express.Router();
const userAuthMiddleware = require("../middlware/userAuthMiddleware");
const {submitCode,runCode, submissionsProblem} = require("../controllers/Submissions");
submitRouter.post("/submit/:id", userAuthMiddleware, submitCode);
submitRouter.post("/run/:id", userAuthMiddleware,  runCode)
submitRouter.get("/submissions/:pid", userAuthMiddleware,  submissionsProblem)
module.exports = submitRouter;
