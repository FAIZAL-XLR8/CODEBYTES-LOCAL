// problem creator is Admin and we will authenticate him and add to DB after authenticating the data provided in body of request
const errorCode = require("../utils/statusID");
const videoSolution = require ("../Schemas/cloudinarySchema")
const {
  getLanguageId,
  submitBatch,
  submitToken,
} = require("../utils/problemID");
const problemCollection = require("../Schemas/problemsSchema");
const submissonCollection = require("../Schemas/submissionSchema");
const createProblem = async (req, res) => {
  const {
    title,
    difficulty,
    description,
    tags,
    visibleTestCase,
    startCode,
    hiddenTestCase,
    referenceSolution,
  } = req.body;

  try {
    // below code creates batches of submissions for various i/p and o/p for each language eg : c++
    //c++ --> batch(submission[array])
    //rsn of doing it ?? we want to send post request to judg0 in batches
    req.setTimeout(120000); // 2 minutes
    res.setTimeout(120000);
    for (const { language, solutionCode } of referenceSolution) {
      const languageId = getLanguageId(language);
      const submissions = visibleTestCase.map((item) => {
        return {
          source_code: solutionCode,
          language_id: languageId,
          stdin: item.input,
          expected_output: item.output,
        };
      });
      const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((ele) => ele.token);

      const testResult = await submitToken(resultToken);
      for (const test of testResult) {
        const statusId = Number(test.status.id);

        if (statusId !== 3) {
          const err = errorCode.find(
            (ele) => Number(ele.id) === Number(statusId !== 3)
          );

          if (!err) {
            return res
              .status(400)
              .send("Unknown Judge0 status_id: " + test.status_id);
          }
          return res.status(400).send(err.description);
        }
      }
    }

    // now we can send reference Solution to our DB

    await problemCollection.create({
      ...req.body,
      problemCreator: req.user._id,
    });
    res.status(201).send("Problem created successfully!");
  } catch (err) {
    throw new Error(err.message);
  }
};
const updateProblem = async (req, res) => {
  const { id } = req.params;
  if (!id || !(await problemCollection.findById(id))) {
    throw new Error("Prblem Id not found");
  }
  const {
    title,
    difficulty,
    description,
    tags,
    visibleTestCase,
    startCode,
    hiddenTestCase,
    referenceSolution,
  } = req.body;

  try {
    // below code creates batches of submissions for various i/p and o/p for each language eg : c++
    //c++ --> batch(submission[array])
    //rsn of doing it ?? we want to send post request to judg0 in batches
    for (const { language, solutionCode } of referenceSolution) {
      const languageId = getLanguageId(language);
      const submissions = visibleTestCase.map((item) => {
        return {
          source_code: solutionCode,
          language_id: languageId,
          stdin: item.input,
          expected_output: item.output,
        };
      });
      const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((ele) => ele.token);

      const testResult = await submitToken(resultToken);
      for (const test of testResult) {
        const statusId = Number(test.status.id);

        if (statusId !== 3) {
          const err = errorCode.find(
            (ele) => Number(ele.id) === Number(statusId !== 3)
          );

          if (!err) {
            return res
              .status(400)
              .send("Unknown Judge0 status_id: " + test.status_id);
          }
          return res.status(400).send(err.description);
        }
      }
    }
    const updatedData = await problemCollection.findByIdAndUpdate(
      id,
      req.body,
      { runValidators: true, new: true }
    );
    res.status(200).send(updatedData);
  } catch (err) {
    throw new Error(err.message);
  }
};
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await problemCollection.findById(id);
    if (!id || !problem) {
      throw new Error("Prblem Id not found");
    }
    const deletedData = await problemCollection.findByIdAndDelete(id);
    res.status(200).send(`Data deleted :  ${deletedData}`);
  } catch (err) {
    res.send(err.message);
  }
};
const getProblemById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Id is missing");
  }
  const getProblem = await problemCollection
    .findById(id)
    .select(
      "title tags visibleTestCase difficulty description _id referenceSolution startCode"
    );
    //fetch the url of the video stored in the cloudinary 

  if (getProblem) {
        const video = await videoSolution?.findOne({problemId : id});
        if(video)
        {
          const modifiedProblem = {
            ...getProblem.toObject(), 
        secureUrl : video.secureUrl,
          cloudinaryPublicId : video.cloudinaryPublicId,
          
              duration : video.duration ,
          }
          return  res.status(200).send(modifiedProblem);
        }
   return  res.status(200).send(getProblem);
  } else {
    throw new Error("problem with specific id doesnt exists!");
  }
};
const getAllProblems = async (req, res) => {
  const allProblems = await problemCollection
    .find()
    .select("title tags _id difficulty");
  if (allProblems.length === 0) {
    return res.send("Empty no Problem");
  }
  res.status(200).send(allProblems);
};
 const solvedProblemsbyUsers = async (req, res) => {
    try {
      const user = req.user;
      await user.populate({
        path : "problemSolved",
        select : "title tags _id difficulty"
      });
   
      res.status(200).send({count: user.problemSolved.length, solvedProblems: user.problemSolved
      });

      // const solvedProblems = await problemCollection
      //   .find({ _id: { $in: user.problemSolved } })
      //   .select("title tags _id difficulty");
      // res.status(200).send({count: solvedProblems.length,solvedProblems});
    } catch (err) {
      res.status(500).send("Server Error: " + err.message);
    }
 };
 const submissionsProblem = async (req, res) => {
  try{
    const pid = req.params.pid;
    const user = req.user;
    const submissions = await submissonCollection.find({userId : user._id, problemId : pid});
    if(submissions.length === 0){
      return res.status(200).send("No submissions found for this problem by the user");
    }
    res.status(200).send(submissions);
  }
  catch(err){
    res.status(500).send("Server Error: " + err.message);
  }
}
module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  solvedProblemsbyUsers,
  submissionsProblem
};
/*
body of post/submission/in batch of judg0
{
  "submissions": [
    {
      "language_id": 46,
      "source_code": "echo hello from Bash"
    },
    {
      "language_id": 71,
      "source_code": "print(\"hello from Python\")"
    },
    {
      "language_id": 72,
      "source_code": "puts(\"hello from Ruby\")"
    }
  ]
}
  */
