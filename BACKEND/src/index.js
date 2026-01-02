require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const userCollection = require("./Schemas/userSchema");
const apiLimiter = require("./RATE-LIMITERS/apiLimiter")
const app = express();

const cors = require('cors');
app.use(cors({
  origin :  "http://localhost:5173",
  credentials : true,
}))
app.use(express.json());
app.use(cookieParser());
// app.use(apiLimiter);
const authRoute = require("./Routes/userAuth");
const connectDB = require("./config/dbConnect");
const redisClient = require("./config/redis");
const problemRoute = require("./Routes/problem");
const submitRoute = require("./Routes/submit");
const aiRouter = require ("../src/Routes/ai")
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});
const videoRouter = require("./Routes/videoCreator");

app.use("/submission", submitRoute);
app.use("/user", authRoute);
app.use("/problem", problemRoute);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
async function initialiseConnection() {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);
    console.log("Database and Redis activated!");
    app.listen(process.env.PORT, () => {
      console.log(`Listening at port number : ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
initialiseConnection();
