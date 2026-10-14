# 🚀 CodeBytes — Intelligent Full-Stack Online Judge & DSA Platform

**CodeBytes** is a modern, high-performance online judge and Data Structures & Algorithms (DSA) learning platform inspired by LeetCode and Codeforces. It integrates an in-browser VS Code-powered editor (Monaco), remote multi-language code compilation and testing (Judge0), Google Gemini AI pair-programming and code analysis, Cloudinary video solutions, Redis-based rate limiting, and an interactive GitHub-style activity heatmap.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features](#-key-features)
- [Tech Stack & Third-Party Services](#-tech-stack--third-party-services)
- [Folder Structure](#-folder-structure)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Getting Started & How to Run](#-getting-started--how-to-run)
  - [Prerequisites](#prerequisites)
  - [Option 1: Local Development (Recommended)](#option-1-local-development-recommended)
  - [Option 2: Single-Container Production Docker](#option-2-single-container-production-docker)
  - [Option 3: Separate Docker Containers](#option-3-separate-docker-containers)
  - [Option 4: AWS ECS / ECR Deployment](#option-4-aws-ecs--ecr-deployment)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Security & Performance Optimizations](#-security--performance-optimizations)

---

## 🌐 Overview & Architecture

CodeBytes is designed as a modular decoupled system with production-ready full-stack unification:

- **Frontend (Client)**: Built with React 19, Vite, Tailwind CSS v4, and DaisyUI. Monaco Editor provides syntax highlighting, auto-indentation, and multi-language support. Redux Toolkit manages global auth, editor state, and problem cache.
- **Backend (API Server)**: Powered by Express 5 and Node.js 22. Handles RESTful routing, authentication with JWT stored in HTTP-only cookies, automated problem test verification, and rate limiting with Redis.
- **Remote Code Execution**: Batched sandbox code execution via Judge0 CE on RapidAPI, supporting C, C++, Java, Python, and JavaScript.
- **AI Copilot**: Integrated with Google Gemini 3.1 Flash Lite (`@google/genai`) to provide real-time code analysis, Big-O complexity audits, next-lines smart code suggestions, and a conversational DSA study assistant.
- **Media Engine**: Cloudinary integration for signed, secure direct-from-browser video uploads and CDN streaming of editorial video walkthroughs.
- **Deployment Flexibility**: Can run as dual local servers, as independent microservice containers, or unified into a single lightweight multi-stage production Docker container where Express serves both the API and the React production build.

```
                           +---------------------------+
                           |   Browser / React Client  |
                           +-------------+-------------+
                                         |
                       REST API / Cookies| (Monaco Editor & UI)
                                         v
                           +---------------------------+
                           |      Express 5 Server     |
                           +---+-------+-------+---+---+
                               |       |       |   |
            +------------------+       |       |   +-------------------+
            |                          |       |                       |
            v                          v       v                       v
     +--------------+           +----------+ +-----------+     +---------------+
     | MongoDB Atlas|           |Redis In- | | Cloudinary|     | RapidAPI      |
     | (Mongoose)   |           |Memory DB | | Video CDN |     | (Judge0 CE)   |
     +--------------+           +----------+ +-----------+     +---------------+
            ^                                                          ^
            |                   +------------------+                   |
            +-------------------| Google Gemini AI |-------------------+
                                | (Gemini Flash)   |
                                +------------------+
```

---

## ✨ Key Features

### 💻 1. Interactive Coding Workspace (Monaco Editor)
- **Multi-Language Support**: Seamlessly write and execute code in **C**, **C++**, **Java**, **Python**, and **JavaScript**.
- **Run vs. Submit**:
  - **Run Code**: Tests user code against visible test cases with custom stdin/stdout diffs.
  - **Submit Code**: Evaluates against hidden edge cases, calculates exact execution time (runtime in ms) and peak memory usage, updates problem solved counts, and logs submission records.
- **Starter Templates**: Boilerplate code automatically loaded for each language.

### 🤖 2. Google Gemini AI Pair Programmer
- **Code Analyzer**: Evaluates submitted code for:
  - Big-O Time and Space Complexity.
  - Variable naming and code cleanliness.
  - Optimization paths (e.g., transitioning from $O(N^2)$ to $O(N \log N)$).
  - Unhandled edge cases (empty arrays, negative bounds, overflow).
- **Next-Lines Autocomplete**: Analyzes partial code, detects potential logic pitfalls, and provides a 4-line snippet suggestion with rationales and code diff preview.
- **DSA Study Assistant**: An interactive conversational chatbot that guides students intuitively through algorithms without giving away immediate answers.

### 🛡️ 3. Administrative Control Panel
- **Automated Validation on Creation**: When an administrator creates a problem, the server runs the admin's reference solution against all visible and hidden test cases via Judge0 before writing to MongoDB.
- **Problem Management**: Create, edit, and delete problems, tags, difficulty levels (`easy`, `medium`, `hard`), and boilerplate code.
- **Video Solution Management**: Generate Cloudinary upload signatures and upload official video solution walkthroughs directly linked to problem IDs.

### 📊 4. Developer Profiles & Activity Heatmap
- **GitHub-style 365-Day Activity Heatmap**: Visual breakdown of daily problem-solving streaks, attempts vs. passes, and language usage.
- **Problem Analytics**: Solved problem counts segmented by difficulty and topic tags (`array`, `linkedList`, `graph`, `dp`).

### 💬 5. Community Discussions
- Dedicated comment threads per problem allowing peer-to-peer discussions, algorithmic insights, and community help.

### ⚡ 6. Rate Limiting & High-Availability
- **Redis Sliding-Window Rate Limiters**: Prevents brute-forcing and Judge0 quota exhaustion with custom limiters (`apiLimiter` and `sbmsnProb`).
- **Health Check Endpoint**: `/health` built for AWS Application Load Balancer (ALB) and ECS container monitoring.

---

## 🛠️ Tech Stack & Third-Party Services

### **Frontend**
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Declarative UI framework |
| **Vite** | `^7.2.4` | Ultra-fast build tool and dev server |
| **Tailwind CSS** | `^4.1.18` | Utility-first styling framework |
| **DaisyUI** | `^5.5.11` | Semantic UI component library |
| **Monaco Editor** | `^4.7.0` | Browser-based code editor (VS Code engine) |
| **Redux Toolkit** | `^2.11.2` | Centralized state management |
| **React Router** | `^7.10.1` | Client-side routing and page transitions |
| **Framer Motion** | `^12.42.2` | Smooth micro-interactions and transitions |
| **Lucide React** | `^0.561.0` | Modern, consistent icon set |
| **React Hook Form & Zod** | `^7.68.0` / `^4.1.13` | Type-safe form validation |
| **React Hot Toast** | `^2.6.0` | Non-blocking notification toasts |
| **Axios** | `^1.13.2` | Promise-based HTTP client |

### **Backend**
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v22.x` | JavaScript server runtime |
| **Express** | `^5.1.0` | REST API framework |
| **Mongoose** | `^8.19.3` | MongoDB Object Data Modeling (ODM) |
| **Redis Client** | `^5.9.0` | In-memory caching and distributed rate limiting |
| **JSON Web Token (JWT)** | `^9.0.2` | Stateless authentication tokens |
| **Bcrypt** | `^6.0.0` | Secure one-way password hashing |
| **Cookie Parser** | `^1.4.7` | Secure cookie handling for auth tokens |
| **Validator** | `^13.15.20` | String sanitation and schema validation |

### **Third-Party Services & Cloud APIs**
| Service | Provider | Integration Purpose |
| :--- | :--- | :--- |
| **Judge0 CE** | [RapidAPI](https://rapidapi.com/hermanzdosilovic/api/judge0-ce) | Remote code compilation & sandboxed batch execution |
| **Gemini 3.1 Flash Lite** | [Google Cloud GenAI](https://ai.google.dev/) | Code review, hint generation, and AI DSA tutor |
| **Cloudinary** | [Cloudinary](https://cloudinary.com/) | Direct signed video uploads, video storage, and streaming |
| **MongoDB Atlas** | [MongoDB](https://www.mongodb.com/atlas) | Cloud-hosted NoSQL document database |
| **Redis Cloud** | [Redis](https://redis.io/cloud/) | Cloud Redis instance for rate limiting and cache |
| **Amazon Web Services** | AWS (ECR, ECS, ALB) | Container registries and scalable production hosting |

---

## 📂 Folder Structure

```text
CODEBYTES-LOCAL/
├── .dockerignore                 # Root Docker build ignore rules
├── .env.production               # Production deployment references (AWS, ECR URIs)
├── Dockerfile                    # Unified multi-stage Docker build (Frontend + Backend)
├── README.md                     # Project documentation
│
├── BACKEND/                      # Express 5 REST API Server
│   ├── .dockerignore             # Backend Docker ignore rules
│   ├── .env                      # Local environment secrets (DB, Redis, API keys)
│   ├── .gitignore                # Git ignore rules for backend
│   ├── Dockerfile                # Standalone backend container definition
│   ├── package.json              # Backend dependencies and run scripts
│   └── src/
│       ├── index.js              # Application entry point, DB/Redis initialization & routing
│       ├── config/
│       │   ├── dbConnect.js      # MongoDB Mongoose connection handler
│       │   └── redis.js          # Redis client configuration & error listeners
│       ├── controllers/
│       │   ├── Submissions.js    # Code execution, Judge0 batch polling & submission storage
│       │   ├── aichat.js         # Google Gemini AI prompts (analyze, suggest, study assistant)
│       │   ├── discussionController.js # Problem discussion comments & user stats
│       │   ├── problemsFunc.js   # Problem CRUD & pre-save Judge0 solution verification
│       │   ├── testing.js        # Test endpoints
│       │   ├── userAuthenticate.js # Register, login, profile, 365-day activity heatmap
│       │   └── videoSection.js   # Cloudinary signed upload generation & metadata persistence
│       ├── middlware/
│       │   ├── adminKAMiddlware.js # Role-based access control (Admin verification)
│       │   └── userAuthMiddleware.js # JWT verification and user population
│       ├── RATE-LIMITERS/
│       │   ├── apiLimiter.js     # Redis-backed IP request rate limiter (60 req / hr)
│       │   └── sbmsnProb.js      # Submission-specific limiter
│       ├── Routes/
│       │   ├── ai.js             # /ai routes (chat, analyze, suggest, study-assistant)
│       │   ├── discussion.js     # /discussion routes (comments, stats)
│       │   ├── problem.js        # /problem routes (CRUD, listing, solve status)
│       │   ├── submit.js         # /submission routes (run, submit, history)
│       │   ├── userAuth.js       # /user routes (register, login, logout, profile, heatmap)
│       │   └── videoCreator.js   # /video routes (signature generation, metadata save)
│       ├── Schemas/
│       │   ├── cloudinarySchema.js # Video solution metadata schema
│       │   ├── discussionSchema.js # Comment thread schema
│       │   ├── problemsSchema.js   # Problem, test cases, and starter code schema
│       │   ├── submissionSchema.js # User submission results & status schema
│       │   └── userSchema.js       # User profile, solved problems, and role schema
│       ├── utils/
│       │   ├── problem.js        # Seed problem utilities
│       │   ├── problemID.js      # Judge0 language ID mapper and batch polling logic
│       │   └── statusID.js       # Judge0 status code descriptions
│       └── Validator/
│           └── validteUser.js    # Validator.js email & password strength sanitization
│
└── FRONTEND/                     # React 19 + Vite Client
    ├── .dockerignore             # Frontend Docker ignore rules
    ├── .env.production           # Frontend production environment (API URL)
    ├── .gitignore                # Git ignore rules for frontend
    ├── .npmrc                    # NPM package configuration
    ├── Dockerfile                # Standalone frontend container definition
    ├── eslint.config.js          # ESLint configuration
    ├── index.html                # HTML5 entry template
    ├── package.json              # Frontend dependencies and Vite scripts
    ├── vite.config.js            # Vite configuration with React & Tailwind plugins
    ├── PAGES/                    # Primary application views
    │   ├── Editorial.jsx         # Solution editorial page
    │   ├── LandingPage.jsx       # Hero, feature highlights, and navigation
    │   ├── Login.jsx             # User authentication login view
    │   ├── PerProblemPage.jsx    # Split-screen problem solver workspace with Monaco Editor
    │   ├── ProblemsPage.jsx      # Filterable problem catalog with search and tag filters
    │   ├── ProfilePage.jsx       # User dashboard, statistics, and 365-day Activity Heatmap
    │   ├── Signup.jsx            # New user registration view
    │   ├── StudyAssistant.jsx    # Dedicated AI interactive learning assistant
    │   ├── adminPanel.jsx        # Admin dashboard for creating problems and uploading videos
    │   ├── chatAi.jsx            # In-workspace AI assistant drawer
    │   └── components/
    │       └── problem/
    │           ├── AIAnalyser.jsx       # AI code breakdown & complexity review drawer
    │           ├── CodeEditor.jsx       # Monaco Editor wrapper with language switcher
    │           ├── DiffModal.jsx        # Side-by-side code suggestion diff modal
    │           ├── Discussion.jsx       # Problem discussion thread UI
    │           ├── ProblemDescription.jsx # Problem statement, constraints & examples
    │           ├── Solutions.jsx        # Official video player and written solutions
    │           ├── SubmissionResult.jsx # Test pass/fail, memory & runtime cards
    │           ├── SubmissionsTab.jsx   # Tabular history of previous submissions
    │           └── TestResults.jsx      # Console output and test case run results
    └── src/
        ├── App.jsx               # Router configuration, Auth initialization & Toaster
        ├── App.css               # Global application CSS
        ├── authSlice.js          # Redux slice for authentication state
        ├── index.css             # Tailwind CSS v4 imports
        ├── main.jsx              # React DOM render root
        ├── components/
        │   ├── ConfirmDialog.jsx # Reusable action confirmation modal
        │   └── Footer.jsx        # Application footer
        ├── store/
        │   └── store.js          # Redux store configuration
        └── utils/
            ├── axiosClient.js    # Configured Axios instance with auto-detect API URL
            └── codeSlice.js      # Redux slice for editor code persistence
```

---

## 🔐 Environment Variables Configuration

### 1. Backend (`BACKEND/.env`)
Create a `.env` file inside the `BACKEND` directory with the following variables:

```env
# Server Configuration
PORT=3000

# MongoDB Database URI (MongoDB Atlas or Local)
CONNECT_DB=mongodb+srv://<username>:<password>@cluster.mongodb.net/Leetcode?retryWrites=true&w=majority

# JWT Secret for Session Authentication
JWT_KEY=your_super_secret_jwt_key_here

# Redis Cache & Rate Limiting Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_KEY=your_redis_password_if_any
REDIS_USERNAME=default

# RapidAPI Judge0 Credentials (for Code Execution)
RAPID_API_KEY=your_rapidapi_judge0_key_here
RAPID_API_HOST=judge0-ce.p.rapidapi.com

# Google Gemini API Key (for AI Code Analysis & Tutor)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Cloudinary Credentials (for Video Solutions)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Allowed Frontend URL for CORS (in Development or Production)
FRONTEND_URL=http://localhost:5173
```

### 2. Frontend (`FRONTEND/.env`) *(Optional in local development)*
In local development, the frontend automatically defaults to `http://localhost:3000`. If you need to override the backend API URL, create `FRONTEND/.env`:

```env
# URL where the backend API is running
VITE_API_URL=http://localhost:3000
```
> **Note for Production**: In unified Docker builds, `VITE_API_URL` is set to an empty string `""` so that Axios automatically issues relative requests to the same origin.

---

## 🚀 Getting Started & How to Run

### Prerequisites
Before running CodeBytes, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or v22 LTS recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(optional, for containerized execution)*
- A running **MongoDB** instance (or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A running **Redis** instance (local Redis server or free [Redis Cloud](https://redis.io/cloud/))

---

### Option 1: Local Development (Recommended)

Run the backend and frontend in separate terminals for instant Hot Module Replacement (HMR).

#### Step 1: Clone the repository
```bash
git clone <repository-url>
cd CODEBYTES-LOCAL
```

#### Step 2: Set up and run the Backend
Open Terminal 1:
```bash
# Navigate to the backend folder
cd BACKEND

# Install dependencies
npm install

# Ensure BACKEND/.env is configured with your database and API keys
# Run in development mode with nodemon
npm run dev
```
> The backend server will start on `http://localhost:3000` (or the port defined in `.env`). You should see:
> `Database and Redis activated!`
> `Listening on port 3000`

#### Step 3: Set up and run the Frontend
Open Terminal 2:
```bash
# Navigate to the frontend folder
cd FRONTEND

# Install dependencies
npm install

# Run Vite development server
npm run dev
```
> The frontend will launch at:
> `http://localhost:5173`

Open `http://localhost:5173` in your browser. Register an account, browse problems, and begin solving!

---

### Option 2: Single-Container Production Docker

The root of this project includes a multi-stage `Dockerfile` that builds the React frontend, places its static output directly into the Express backend's public directory, and serves the entire application from a single port (`3000`).

#### Step 1: Build the Docker Image
From the repository root (`CODEBYTES-LOCAL`):
```bash
docker build -t codebytes:latest .
```

#### Step 2: Run the Docker Container
Pass your environment configuration via your existing `BACKEND/.env` file:
```bash
docker run -d \
  --name codebytes-app \
  -p 3000:3000 \
  --env-file BACKEND/.env \
  codebytes:latest
```

#### Step 3: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```
- The frontend is served directly by Express.
- All API requests route locally without any CORS overhead.
- Container health can be checked at `http://localhost:3000/health`.

To inspect logs:
```bash
docker logs -f codebytes-app
```

To stop the container:
```bash
docker stop codebytes-app && docker rm codebytes-app
```

---

### Option 3: Separate Docker Containers

If you prefer running the backend and frontend in isolated containers:

#### Run Backend Container:
```bash
cd BACKEND
docker build -t codebytes-backend:latest .
docker run -d --name codebytes-backend -p 3000:3000 --env-file .env codebytes-backend:latest
```

#### Run Frontend Container:
```bash
cd FRONTEND
docker build -t codebytes-frontend:latest .
docker run -d --name codebytes-frontend -p 5173:5173 codebytes-frontend:latest
```

---

### Option 4: AWS ECS / ECR Deployment

This repository includes pre-configured AWS deployment definitions (`.env.production`):

```bash
# Authenticate Docker to AWS ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com

# Tag and push Docker images
docker tag codebytes-backend:latest <AWS_ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com/codebytes-backend:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com/codebytes-backend:latest

docker tag codebytes-frontend:latest <AWS_ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com/codebytes-frontend:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com/codebytes-frontend:latest
```



## 🔒 Security & Performance Optimizations

1. **HTTP-Only Cookies & JWT**: Tokens are protected against XSS by being transmitted exclusively in `httpOnly` secure cookies.
2. **Pre-Save Solution Verification**: Admins cannot create problems with broken test cases; reference code must pass all test cases on Judge0 before insertion.
3. **Redis Sliding-Window Rate Limiting**: Mitigates Denial-of-Service (DoS) and prevents abuse of external APIs by limiting submission frequencies.
4. **Base64 Payload Decoding**: Safely handles complex syntax, special characters, and newlines when communicating with remote compiler sandboxes.
5. **CDN Cache Purging**: When video solutions are updated or deleted, Cloudinary cache invalidation is triggered immediately.

---

## 👥 Authors & Acknowledgments

- **Platform Architecture & Development**: Built with modern web standards and high-reliability cloud tools.
- Special thanks to **Judge0** for compiler infrastructure, **Google Gemini** for generative AI reasoning, and **Cloudinary** for video media streaming.
