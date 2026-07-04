require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const userCollection = require("./Schemas/userSchema");
const apiLimiter = require("./RATE-LIMITERS/apiLimiter");

const connectDB = require("./config/dbConnect");
const redisClient = require("./config/redis");

const authRoute = require("./Routes/userAuth");
const problemRoute = require("./Routes/problem");
const submitRoute = require("./Routes/submit");
const aiRouter = require("./Routes/ai");
const videoRouter = require("./Routes/videoCreator");
const discussionRoute = require("./Routes/discussion");

const app = express();
app.set("trust proxy", 1);

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

// Logging middleware
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// ================= API ROUTES =================

app.use("/submission", submitRoute);
app.use("/user", authRoute);
app.use("/problem", problemRoute);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/discussion", discussionRoute);

// ================= FRONTEND =================

const frontendPath = path.join(__dirname, "../../FRONTEND/dist");

console.log("Frontend Path:", frontendPath);
console.log("Frontend Exists:", fs.existsSync(frontendPath));
console.log(
  "Index Exists:",
  fs.existsSync(path.join(frontendPath, "index.html"))
);

app.use(express.static(frontendPath));

app.use((req, res, next) => {
  if (req.path.startsWith("/problem") ||
      req.path.startsWith("/user") ||
      req.path.startsWith("/submission") ||
      req.path.startsWith("/ai") ||
      req.path.startsWith("/video") ||
      req.path.startsWith("/discussion")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ================= SERVER =================

async function initialiseConnection() {
  try {
    await Promise.all([
      connectDB(),
      redisClient.connect()
    ]);

    console.log("Database and Redis activated!");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Listening on port ${process.env.PORT || 5000}`
      );
    });
  } catch (err) {
    console.error(err);
  }
}

initialiseConnection();