const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.CONNECT_DB;
async function connectDB() {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = connectDB;
