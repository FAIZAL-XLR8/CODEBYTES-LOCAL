// models/Video.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;


const videoSchema = new mongoose.Schema({
  // Basic Information
  problemId : {
    type : Schema.Types.ObjectId,
    ref : "problemCollection",
    required : true
  },
  userId : {
    type : Schema.Types.ObjectId,
    ref : "userCollection",
    required : true,
  },
 
 
  
  // Cloudinary Data
  
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true
    },
  
    secureUrl: {
      type: String,
      required: true
    },
    format: {
      type: String,
      enum: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv']
    },
    resourceType: {
      type: String,
      default: 'video'
    }
,
  
  // Video Technical Details
 
    duration: {
      type: Number, // in seconds
      required: true
    },
   
 

}, {
  timestamps: true
});
const solutionVideo = mongoose.model('solutionVideo', videoSchema);
module.exports = solutionVideo;