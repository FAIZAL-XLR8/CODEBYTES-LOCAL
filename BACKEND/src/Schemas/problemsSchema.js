const mongoose = require("mongoose");
const { Schema } = mongoose;
const problemKaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      enum: ["array", "linkedList", "graph", "dp"],
      required: true,
    },
    visibleTestCase: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explaination: { type: String, required: true },
      },
    ],
    startCode: [
      {
        language: { type: String, required: true },
        boilerCode: {
          type: String,
          required: true,
        },
      },
    ],
    hiddenTestCase: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "userCollection",
      required: true,
    },
    referenceSolution: [
      {
        language: {
          type: String,
          required: true,
        },
        solutionCode: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
const problemCollection = mongoose.model("problemCollection", problemKaSchema);
module.exports = problemCollection;
