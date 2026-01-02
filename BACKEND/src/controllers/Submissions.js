const problemCollection = require("../Schemas/problemsSchema");
const submissionCollection = require("../Schemas/submissionSchema");
const {
  getLanguageId,
  submitBatch,
  submitToken,
} = require("../utils/problemID");
const errorCode = require("../utils/statusID");

const submitCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;

    const { code, language } = req.body;
    if (!userId || !problemId || !code || !language) {
      return res.status(400).send("All fields are required");
    }
    
    const problem = await problemCollection.findById(problemId);

    const newSubmission = await submissionCollection.create({
      userId,
      problemId,
      code,
      language,
      testCasesTotal: problem.hiddenTestCase.length,
      status: "pending",
    });
    
    const languageId = getLanguageId(language);
    const submissions = problem.hiddenTestCase.map((item) => {
      return {
        source_code: code,
        language_id: languageId,
        stdin: item.input,
        expected_output: item.output,
      };
    });
    
    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((ele) => ele.token);
    const testResult = await submitToken(resultToken);
    
    let testCasesPassed = 0;
    let runtime = 0;
    let maxMemory = 0;
    let status = "accepted";
    let errorMessage = "";
    
    for (const test of testResult) {
      if (Number(test.status.id) === 3) {
        testCasesPassed++;
        runtime += Number(test.time);
        maxMemory = Math.max(maxMemory, Number(test.memory));
      } else {
        const error = errorCode.find(
          (err) => err.id === Number(test.status.id)  
        );
        status = "wrong";
        errorMessage = error ? error.description : test.status.description;
        break;
      }
    }
    
    newSubmission.testCasesPassed = testCasesPassed;
    newSubmission.runtime = runtime;
    newSubmission.memory = maxMemory;
    newSubmission.status = status;
    newSubmission.errorMessage = errorMessage;
    await newSubmission.save();
    
    const user = req.user;
    if (!user.problemSolved?.includes(problemId) && status === "accepted") {
      user.problemSolved.push(problemId);
      await user.save();
    }
    
    return res.status(200).json(newSubmission);
  } catch (err) {
    console.error("❌ Error in submitCode:", err);
    console.error("Error details:", err.response?.data || err.message);
    return res.status(500).send("Server Error: " + err.message);
  }
};

const runCode = async (req, res) => {
  try {
   
    const userId = req.user._id;
    const problemId = req.params.id;
    const { code, language } = req.body;
    
    if (!userId || !problemId || !code || !language) {
      return res.status(400).send("All fields are required");
    }
    
    const problem = await problemCollection.findById(problemId);
    
    const languageId = getLanguageId(language);
   
    
    const submissions = problem.visibleTestCase.map((item) => {
      return {
        source_code: code,
        language_id: languageId,
        stdin: item.input,
        expected_output: item.output,
      };
    });

    
   
    try {
      const submitResult = await submitBatch(submissions);
      

      const resultToken = submitResult.map((ele) => ele.token);
      const testResult = await submitToken(resultToken);
      
     

      const results = testResult.map((test, index) => {
       
        return {
          status: test.status.description,
          time: test.time,
          memory: test.memory,
          stdout: test.stdout,
          stderr: test.stderr,
          expected_output: test.expected_output,
        };
      });

      return res.status(200).json(results);
      
    } catch (judge0Error) {
      console.error(' Judge0 Error:', judge0Error.message);
      console.error('Judge0 Response:', judge0Error.response?.data);
      console.error('Judge0 Status:', judge0Error.response?.status);
      
      // Return detailed error to frontend
      return res.status(500).json({
        success: false,
        error: 'Judge0 submission failed',
        details: judge0Error.response?.data || judge0Error.message,
        submissions: submissions // Send back what we tried to submit
      });
    }
    
  } catch (err) {
    console.error("Error in runCode:", err);
    console.error("Stack trace:", err.stack);
    return res.status(500).send("Server Error: " + err.message);
  }
};

const submissionsProblem = async (req, res) => {
  try {
    const pid = req.params.pid;
    const user = req.user;
    
   
    // Find all submissions for this problem by this user
    const submissions = await submissionCollection
      .find({ userId: user._id, problemId: pid })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    if (submissions.length === 0) {
      return res.status(200).json([]);
    }
    
    
    res.status(200).json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: "Server Error: " + err.message });
  }
};
module.exports = { submitCode, runCode , submissionsProblem};