
const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const http = require('http');


router.get('/', async (req, res) => {
const videoURL = req.query.url;
  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

  const videoStream = ytdl(videoURL, { format: 'mp4' });

  // Set the Content-Type header based on the video format
  res.setHeader('Content-Type', 'video/mp4');

  // Send the video stream as the response
  videoStream.pipe(res);

  // Handle errors
  videoStream.on('error', (err) => {
    console.error(err);
    res.statusCode = 500;
    res.end('Error fetching video');
  });
});

module.exports = router;
