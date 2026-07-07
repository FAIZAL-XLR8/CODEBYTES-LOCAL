  const validateUser = require("../Validator/validteUser");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const userCollection = require("../Schemas/userSchema");
  const redisClient = require("../config/redis");
  const submissonCollection = require("../Schemas/submissionSchema");
const register = async (req, res) => {
  try {
   
    const user = req.body;
    user.role = "user";
    
    // Add emailID if it comes as email from frontend
    if (!user.emailID && user.email) {
      user.emailID = user.email;
    }
    
    validateUser(user);
    
    const hashpassword = await bcrypt.hash(user.password, 10);
    user.password = hashpassword;
    const assignedUser = await userCollection.create(user);
    
  
    
    const replyUser = {
      username: assignedUser.firstName,  
      email: assignedUser.emailID, 
      problemSolved: assignedUser.problemSolved.length,
      role : assignedUser.role,
    };
    
  
 
    res.status(201).send({  message: "User created!" });
    
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    
    let errorMessage = "Registration failed";
    
    
    if (err.code === 11000) {
      errorMessage = "Email already registered!";
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(400).send({ error: errorMessage });
  }
};
 const login = async (req, res) => {
  try {
    const { emailID, password } = req.body;
    if (!emailID) {
      throw new Error("Email required!");
    }
    if (!password) {
      throw new Error("Password required!");
    }
    const user = await userCollection.findOne({ emailID });
    if (!user) {
      throw new Error("Account doesn't exist. Please register!");
    }
    const isVerifiedUser = await bcrypt.compare(password, user.password);
    if (isVerifiedUser) {
      const token = jwt.sign(
        {
          _id: user._id,
          emailID: user.emailID,
          role: user.role,
        },
        process.env.JWT_KEY,
        { expiresIn: 30 * 60 }
      );
      
      const replyUser = {
        userName: user.firstName,  
        email: user.emailID, 
        problemSolved: user.problemSolved.length,
        role : user.role
      };
      
      res.cookie("token", token, {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({ user: replyUser, message: "Login successful!" });
    } else {
      throw new Error("Invalid password!");
    }
    
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
};
  const logout = async (req, res) => {
    try {
      const { token } = req.cookies;
      const payload = jwt.decode(token);
      await redisClient.set(`token:${token}`, "blocked");
      await redisClient.expireAt(`token:${token}`, payload.exp);
      res.status(200).send("logged out!");
    } catch (err) {
      res.send(err.message);
    }
  };
  const getProfile = async (req, res) => {
    try {
      const { token } = req.cookies;
      const payload = jwt.verify(token, process.env.JWT_KEY);
      const { _id, emailID } = payload;
      const user = await userCollection.findOne({ emailID });
      const replyUser = {
        username: user.firstName,
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.emailID, 
        problemSolved: user.problemSolved.length,
        role : user.role,
        createdAt: user.createdAt
      };
      
      res.status(200).send({user : replyUser});
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  };
  const adminRegister = async (req, res) => {
    const user = req.body;
    validateUser(user);
    user.role = "admin";
    const hashpassword = await bcrypt.hash(user.password, 10);
    user.password = hashpassword;
    const assignedUser = await userCollection.create(user);
    res.status(200).send("New Admin registered!");
  };
  const deleteProfile = async (req, res) => {
    try{
      const user = req.user;
      const deletedUser = await userCollection.findByIdAndDelete(user._id);
      // the above line deletes the profile from DB

      // below lines deletes all the submissions made by the user
      await submissonCollection.deleteMany({userId : user._id});

      res.status(200).send("Profile a nd all submissions deleted successfully");
    }
    catch(err){
      res.status(200).send(err.message);
    }
  }

  const getActivityHeatmap = async (req, res) => {
    try {
      const userId = req.user._id;

      // Find all submissions in the last year
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);

      const submissions = await submissonCollection.find({
        userId,
        createdAt: { $gte: oneYearAgo }
      })
      .populate("problemId", "title")
      .sort({ createdAt: 1 });

      // Group submissions by local date (YYYY-MM-DD)
      const heatmap = {};

      submissions.forEach(sub => {
        if (!sub.createdAt) return;
        
        // Format to YYYY-MM-DD
        const dateStr = sub.createdAt.toISOString().split('T')[0];

        if (!heatmap[dateStr]) {
          heatmap[dateStr] = {
            solved: [],
            attempts: {
              wrong: 0,
              error: 0,
              timeLimit: 0
            },
            languages: []
          };
        }

        // Handle solved / accepted problems
        if (sub.status === 'accepted') {
          const problemTitle = sub.problemId?.title || "Unknown Problem";
          if (!heatmap[dateStr].solved.includes(problemTitle)) {
            heatmap[dateStr].solved.push(problemTitle);
          }
        } else {
          // Handle failed attempts
          if (sub.status === 'wrong') {
            heatmap[dateStr].attempts.wrong++;
          } else if (sub.status === 'error') {
            // Check if it's a TLE error or standard compile/runtime error
            if (sub.errorMessage && sub.errorMessage.toLowerCase().includes('time limit')) {
              heatmap[dateStr].attempts.timeLimit++;
            } else {
              heatmap[dateStr].attempts.error++;
            }
          }
        }

        // Collect unique languages
        if (sub.language && !heatmap[dateStr].languages.includes(sub.language)) {
          heatmap[dateStr].languages.push(sub.language);
        }
      });

      res.status(200).json(heatmap);
    } catch (err) {
      console.error("Heatmap fetch error:", err);
      res.status(500).json({ error: "Failed to generate activity heatmap" });
    }
  };

  module.exports = { register, login, logout, getProfile, adminRegister, deleteProfile, getActivityHeatmap };
 
