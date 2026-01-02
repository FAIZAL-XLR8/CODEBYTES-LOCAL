const cloudinary = require ("cloudinary").v2;
const problemCollection = require ("../Schemas/problemsSchema");
const solutionVideoSchema = require("../Schemas/cloudinarySchema")
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
const generateUploadSignature = async (req, res) => {
  try {
   const userId = req.user._id;
   const {problemId} = req.params;
 
   
    const problem = await problemCollection.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;

    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
        
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
};
const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemId,
      cloudinaryPublicId,
      secureUrl,
      duration,
    } = req.body;

    const userId = req.user._id;

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({
        error: 'Video not found on Cloudinary',
      });
    }
const solutionVideo = await solutionVideoSchema.create({
  problemId,
  userId,
  cloudinaryPublicId,
  secureUrl,
  duration: cloudinaryResource.duration || duration,
 
});



res.status(201).json({
  message: 'Video solution saved successfully',
  videoSolution: {
    id: solutionVideo._id,  
   
    duration: solutionVideo.duration,
    uploadedAt: solutionVideo.createdAt,
  },
});

   
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Something went wrong',
    });
  }
};
const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const video = await solutionVideoSchema.findOneAndDelete({problemId : problemId});
    if (!video) {
      return res.status(404).json({
        error: 'Video not found',
      });
    }

    await cloudinary.uploader.destroy(
      video.cloudinaryPublicId,
      {
        resource_type: 'video',
        invalidate: true,
        // invalidation true means that from all the CDNs the cached data is also gone which stores it for sometime
        // though data maybe purged out of main server the cdns keep the cache
      }
    );

    res.json({
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      error: 'Failed to delete video',
    });
  }
};
module.exports = {generateUploadSignature, deleteVideo, saveVideoMetadata}
