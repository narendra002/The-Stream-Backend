const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    overview: {
      type: String,
      required: true,
      trim: true
    },
    backdrop_path: {
      type: String,
      required: true
    },
    poster_path: {
      type: String,
      required: true
    },
    trailer: {
      type: String,
      required: true
    },
    genre: {
      type: [String],
      required: true
    },
    episodes: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      episodeNumber: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      releaseDate: {
        type: Date,
        required: true
      },
      video: {
        type: String,
        required: true
      }
    }],
    releaseYear: {
      type: Number,
      required: true
    },
    createdDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });
  

module.exports=mongoose.model('Anime', animeSchema);
