const express = require('express');
const adminMiddleware = require('../middlware/adminKAMiddlware');
const videoRouter = express.Router();

const {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo
} = require('../controllers/videoSection');

videoRouter.get('/create/:problemId', adminMiddleware, generateUploadSignature);

videoRouter.post('/save', adminMiddleware, saveVideoMetadata);

videoRouter.delete('/:problemId', adminMiddleware, deleteVideo);

module.exports = videoRouter;
