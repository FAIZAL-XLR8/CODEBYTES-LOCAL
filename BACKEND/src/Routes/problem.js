const express = require("express");
const problemRoute = express.Router();
const adminKAMiddlware = require("../middlware/adminKAMiddlware");
const userAuthMiddleware = require("../middlware/userAuthMiddleware");
const { solvedProblemsbyUsers } = require("../controllers/problemsFunc");


const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  submissionsProblem
} = require("../controllers/problemsFunc");
const submissionsProblemLimiter = require("../RATE-LIMITERS/sbmsnProb");

// Admin ka kaam
problemRoute.post("/create", adminKAMiddlware, createProblem);
problemRoute.delete("/delete/:id", adminKAMiddlware, deleteProblem);
problemRoute.put("/update/:id", adminKAMiddlware, updateProblem);
//User ka kaam
problemRoute.get("/problemById/:id", userAuthMiddleware, getProblemById);
problemRoute.get("/getAllProblems", userAuthMiddleware, getAllProblems);
 problemRoute.get("/problemSolvedByUser", userAuthMiddleware, solvedProblemsbyUsers);
 problemRoute.get("/submissionsProblem/:pid", userAuthMiddleware,submissionsProblemLimiter ,submissionsProblem);

module.exports = problemRoute;

