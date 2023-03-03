const express = require("express");
const router = express.Router();
const Anime = require("../Models/Anime.js");

// Create Anime
router.post("/", async (req, res) => {
  const newAnime = new Anime(req.body);
  try {
    const savedAnime = await newAnime.save();
    res.status(201).json(savedAnime);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Anime
router.put("/:id", async (req, res) => {
  try {
    const updatedAnime = await Anime.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedAnime);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Anime
router.delete("/:id", async (req, res) => {
  try {
    await Anime.findByIdAndDelete(req.params.id);
    res.status(200).json("The anime has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Anime
router.get("/:id", async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    res.status(200).json(anime);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Anime
router.get("/", async (req, res) => {
  try {
    const anime = await Anime.find();
    res.status(200).json(anime);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Random Anime
router.get("/random", async (req, res) => {
  const type = req.query.type;
  let anime;

  try {
    if (type == "series") {
      anime = await Anime.aggregate([{ $match: { isSeries: true } }, { $sample: { size: 1 } }]);
    } else {
      anime = await Anime.aggregate([{ $match: { isSeries: false } }, { $sample: { size: 1 } }]);
    }

    res.status(200).json(anime);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Batch Upload Anime
router.post("/batch", async (req, res) => {
  const animeList = req.body;

  try {
    const savedAnime = await Anime.insertMany(animeList);
    res.status(201).json(savedAnime);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
