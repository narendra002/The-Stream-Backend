const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String },
  air_date: { type: String },
  season_number: { type: Number, required: true },
  episode_number: { type: Number, required: true }
});

const TvShowSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  overview: { type: String },
  backdrop_path: { type: String },
  poster_path: { type: String },
  trailer: { type: String },
  content: { type: [EpisodeSchema] }, // an array of Episode documents
  first_air_date: { type: String },
  genre: { type: String },
  season: { type: Number },
  episodes: { type: Number },
  isSeries: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('TvShow', TvShowSchema);
