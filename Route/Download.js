const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const cors = require('cors');

router.get('/', cors(), (req, res) => {
  const videoURL = req.query.url;
  const videoTitle = 'video.mp4';

  res.setHeader('Content-Disposition', `attachment; filename="${videoTitle}"`);
  res.setHeader('Content-Type', 'video/mp4');

  ytdl(videoURL, { format: 'mp4' })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error fetching video');
    })
    .on('response', (videoResponse) => {
      // Set the content length header based on the video size
      res.setHeader('Content-Length', videoResponse.headers['content-length']);
    })
    .pipe(res);
});

module.exports = router;
