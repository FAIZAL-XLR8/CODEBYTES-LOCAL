const mongoose = require("mongoose");
const { Schema } = mongoose;

const discussionKaSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problemCollection",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userCollection",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 500,
    },
  },
  { timestamps: true }
);

const discussionCollection = mongoose.model("discussionCollection", discussionKaSchema);
module.exports = discussionCollection;
