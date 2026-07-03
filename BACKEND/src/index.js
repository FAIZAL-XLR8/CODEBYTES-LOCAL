require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const userCollection = require("./Schemas/userSchema");
const apiLimiter = require("./RATE-LIMITERS/apiLimiter");

const app = express();

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((ao) => origin.startsWith(ao))) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
 app.use(apiLimiter);

const authRoute = require("./Routes/userAuth");
const connectDB = require("./config/dbConnect");
const redisClient = require("./config/redis");
const problemRoute = require("./Routes/problem");
const submitRoute = require("./Routes/submit");
const aiRouter = require("./Routes/ai");
const videoRouter = require("./Routes/videoCreator");
const discussionRoute = require("./Routes/discussion");

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});


app.use("/submission", submitRoute);
app.use("/user", authRoute);
app.use("/problem", problemRoute);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/discussion", discussionRoute);



const frontendPath = path.join(__dirname, "../../FRONTEND/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});



async function initialiseConnection() {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);

    console.log("Database and Redis activated!");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Listening on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.log(err);
  }
}

initialiseConnection();