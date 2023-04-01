const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");



router.get('/convert', (req, res) => {
  const videoUrl = req.query.url;
  const command = ffmpeg(videoUrl);
  
  command.ffprobe((err, data) => {
    if (err) {
      res.status(400).send({ message: 'Invalid video URL' });
    } else {
      const availableResolutions = data.streams
        .filter(stream => stream.codec_type === 'video')
        .map(stream => stream.height + 'p');
      res.status(200).send({ resolutions: availableResolutions });
    }
  });
});

module.exports = router;


router.get('/', async (req, res) => {

  var videoURL = req.query.url;
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  
  const videoStream = ytdl(videoURL, { format: "mp4" });
  
  videoStream.pipe(res);
});
// router.post('/convert', (req, res) => {
//   const { link } = req.body; // assuming the request body contains the video link
//   const resolutions = ['144p', '240p', '360p']; // array of resolutions to transcode to
//   const outputDir = 'output'; // directory to store the transcoded videos
  
//   ffmpeg(link) // create FFmpeg input from the video link
//     .outputOptions('-movflags frag_keyframe+empty_moov') // add output options for smooth streaming
//     .on('error', (err) => {
//       console.log('An error occurred: ' + err.message);
//       res.status(500).send('Error transcoding video');
//     })
//     .on('end', () => {
//       console.log('Transcoding finished');
//       res.send('Video transcoded successfully');
//     })
//     .on('progress', (progress) => {
//       console.log('Transcoding progress: ' + progress.percent + '%');
//     })
//     .output(`${outputDir}/original.mp4`) // transcode the original video to a lower quality
//     .run();
  
//   for (const resolution of resolutions) {
//     ffmpeg(link) // create FFmpeg input from the video link
//       .outputOptions('-movflags frag_keyframe+empty_moov') // add output options for smooth streaming
//       .on('error', (err) => {
//         console.log('An error occurred: ' + err.message);
//       })
//       .on('end', () => {
//         console.log(`Transcoding to ${resolution} finished`);
//       })
//       .on('progress', (progress) => {
//         console.log(`Transcoding to ${resolution} progress: ` + progress.percent + '%');
//       })
//       .output(`${outputDir}/${resolution}.mp4`) // transcode the video to the specified resolution
//       .size(resolution)
//       .run();
//   }
// });
module.exports = router;
