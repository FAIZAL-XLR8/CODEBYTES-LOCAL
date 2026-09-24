require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.some(
          (ao) => cleanOrigin === ao || cleanOrigin.startsWith(ao)
        )
      ) {
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


// Logging middleware
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// ================= HEALTH CHECK / ROOT (For ALB & ECS) =================
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "CodeBytes API is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// ================= API ROUTES =================
app.use("/submission", apiLimiter, submitRoute);
app.use("/user", authRoute);
app.use("/problem", problemRoute);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/discussion", discussionRoute);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
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