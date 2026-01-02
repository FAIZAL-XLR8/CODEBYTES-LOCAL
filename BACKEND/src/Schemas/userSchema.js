const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    emailID: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      immutable: true,
      unique: [true, "this emailID already registered!"],
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 10,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemSolved: {
      type: [{
        type : Schema.Types.ObjectId,
        ref : "problemCollection",
      }],
      unique: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
const userCollection = mongoose.model("userCollection", userSchema);
module.exports = userCollection;
