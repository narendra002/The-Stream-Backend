const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const fs = require('fs');
const cors = require('cors');

router.get('/', cors(), (req, res) => {
  const videoURL = req.query.url;
  const videoTitle = 'video.mp4';

  res.setHeader('Content-Disposition', `attachment; filename="${videoTitle}"`);

  ytdl(videoURL, { format: 'mp4' }).pipe(res);
});

module.exports = router;
