const mongoose = require("mongoose");
const { Schema } = mongoose;
const problemCollection = require("./problemsSchema");
const subSchema = new Schema(
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
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["Java", "Javascript", "C++"],
      required: true,
    },
    status: {
      type: String,
      enum: ["wrong", "accepted", "pending", "error"],
      default: "pending",
    },
    runtime: {
      type: Number,
      default: 0, //milliseconds!
    },
    memory: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
subSchema.index({problemId : 1, userId : 1});
const submissonCollection = mongoose.model("submissionCollection", subSchema);
module.exports = submissonCollection;
