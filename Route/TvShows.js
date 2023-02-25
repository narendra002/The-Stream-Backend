const express = require('express');
const router = express.Router();
const TvShow = require('../Models/TvShow');

// Create Method
router.post('/', async (req, res) => {
  const newTvShow = new TvShow(req.body);
  try {
    const savedTvShow = await newTvShow.save();
    res.status(201).json(savedTvShow);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Method
router.put('/:id', async (req, res) => {
  try {
    const updatedTvShow = await TvShow.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTvShow);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Method
router.delete('/:id', async (req, res) => {
  try {
    await TvShow.findByIdAndDelete(req.params.id);
    res.status(200).json('The TvShow is deleted');
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Method
router.get('/find/:id', async (req, res) => {
  try {
    const tvShow = await TvShow.findById(req.params.id);
    res.status(200).json(tvShow);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Method
router.get('/', async (req, res) => {
  try {
    const tvShows = await TvShow.find();
    res.status(200).json(tvShows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Random Method
router.get('/random', async (req, res) => {
  const type = req.query.type;
  let tvShow;
  try {
    if (type == 'series') {
      tvShow = await TvShow.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      tvShow = await TvShow.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(tvShow);
  } catch (error) {
    res.status(500).json(error);
  }
});


// Create episode method
router.post("/:id/episodes", async (req, res) => {
  try {
    const tvShow = await TvShow.findById(req.params.id);
    tvShow.episodes.push(req.body);
    const updatedTvShow = await tvShow.save();
    res.status(201).json(updatedTvShow);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update episode method
router.put("/:id/episodes/:episodeId", async (req, res) => {
  try {
    const tvShow = await TvShow.findById(req.params.id);
    const episode = tvShow.episodes.id(req.params.episodeId);
    episode.set(req.body);
    const updatedTvShow = await tvShow.save();
    res.status(200).json(updatedTvShow);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete episode method
router.delete("/:id/episodes/:episodeId", async (req, res) => {
  try {
    const tvShow = await TvShow.findById(req.params.id);
    const episode = tvShow.episodes.id(req.params.episodeId).remove();
    const updatedTvShow = await tvShow.save();
    res.status(200).json(updatedTvShow);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get episode method
router.get("/:id/episodes/:episodeId", async (req, res) => {
  try {
    const tvShow = await TvShow.findById(req.params.id);
    const episode = tvShow.episodes.id(req.params.episodeId);
    res.status(200).json(episode);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all episodes method
router.get("/:id/episodes", async (req, res) => {
  try {
    const tvShow = await TvShow.findById(req.params.id);
    res.status(200).json(tvShow.episodes);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create Method for multiple TV shows
router.post("/batch", async (req, res) => {
  const tvShows = req.body;
  try {
    const savedTvShows = await TvShow.insertMany(tvShows);
    res.status(201).json(savedTvShows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Method for multiple TV shows
router.put("/batch", async (req, res) => {
  const tvShows = req.body;
  try {
    const updatedTvShows = await Promise.all(
      tvShows.map(async (tvShow) => {
        const updatedTvShow = await TvShow.findByIdAndUpdate(
          tvShow._id,
          { $set: tvShow },
          { new: true }
        );
        return updatedTvShow;
      })
    );
    res.status(200).json(updatedTvShows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Method for multiple TV shows
router.delete("/batch", async (req, res) => {
  const tvShowIds = req.body;
  try {
    const deletedTvShows = await TvShow.deleteMany({ _id: { $in: tvShowIds } });
    res.status(200).json(deletedTvShows);
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router;
