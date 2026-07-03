const discussionCollection = require("../Schemas/discussionSchema");
const userCollection = require("../Schemas/userSchema");

const getComments = async (req, res) => {
  try {
    const { problemId } = req.params;
    const comments = await discussionCollection.find({ problemId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { problemId, content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const newComment = new discussionCollection({
      problemId,
      userId: req.user._id,
      userName: req.user.firstName + (req.user.lastName ? " " + req.user.lastName : ""),
      content,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userCollection.findById(userId).populate("problemSolved");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const solvedCounts = { easy: 0, medium: 0, hard: 0 };
    (user.problemSolved || []).forEach((p) => {
      if (p.difficulty === "easy") solvedCounts.easy++;
      else if (p.difficulty === "medium") solvedCounts.medium++;
      else if (p.difficulty === "hard") solvedCounts.hard++;
    });

    res.json({
      userName: user.firstName,
      easy: solvedCounts.easy,
      medium: solvedCounts.medium,
      hard: solvedCounts.hard,
      total: user.problemSolved.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getComments,
  addComment,
  getUserStats,
};
