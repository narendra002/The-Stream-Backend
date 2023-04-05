const mongoose = require('mongoose');

const ReviewMovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    overview: {
      type: String,
//       required: true,
    },
    backdrop_path: {
      type: String,
//       required: true,
    },
    poster_path: {
      type: String,
//       required: true,
    },
    trailer: {
      type: String,
//       required: true,
    },
    video: {
      type: String,
//       required: true,
    },
    release_date: {
      type: String,
//       required: true,
    },
    duration: {
      type: String,
//       required: true,
    },
    genre: {
      type: String,
//       required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReviewMovie', ReviewMovieSchema);
