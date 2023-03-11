const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');

router.get('/', async (req, res) => {

  var videoURL = req.query.url;
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  
  const videoStream = ytdl(videoURL, { format: "mp4" });
  
  videoStream.pipe(res);
});

module.exports = router;
