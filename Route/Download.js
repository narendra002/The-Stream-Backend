const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const http = require('http');
const MB = 1024 * 1024;
const zlib = require('zlib');

router.get('/', async (req, res) => {
  try {
    const videoURL = req.query.url;
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    res.header('Content-Encoding', 'gzip'); // Set the Content-Encoding header
    const videoStream = ytdl(videoURL, { format: "mp4" });
    videoStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error fetching video');
    });
    videoStream
      .pipe(zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION })) // Compress the data using gzip
      .pipe(res, { highWaterMark: 1 * MB });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}); 
module.exports = router;
