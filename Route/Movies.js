const express=require("express");
const router=express.Router();
const Movie =require("../Models/Movie.js");
const axios = require('axios');
const cheerio = require('cheerio');
const API_KEY = '4008ea8497eda5d3e80f32017f7d35bc';
const Review =require('../Models/Review');
	// Create Method
router.post("/",async (req,res)=>{
	const newMovie=new Movie (req.body);
	try {
		const savedMovie= await newMovie.save();
		res.status(201).json(savedMovie);
	} catch (error) {
		res.status(500).json(error);
	}
	 
});
router.post("/review",async (req,res)=>{
	const newMovie=new Review (req.body);
	try {
		const savedMovie= await newMovie.save();
		res.status(201).json(savedMovie);
	} catch (error) {
		res.status(500).json(error);
	}
	 
});


router.get('/index', async (req, res) => {
	try {
	  const response = await axios.get('http://103.87.212.46/Data/Movies/Bollywood/');
	  const $ = cheerio.load(response.data);
	  const files = [];
	  $('a').each((index, element) => {
		const description = $(element).text();
		if (description !== '../') {
		  const trimmed = description.slice(0, -7); // eliminate last 6 characters
		  files.push(trimmed);
		}
	  });
	  res.status(200).json(files);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });
  
  


  router.get('/:name', async (req, res) => {
	const name = req.params.name;
	try {
	  const movie = await Movie.findOne({ title: name });
	  if (movie) {
		res.send(movie);
	  } else {
		const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${name}`);
		const results = response.data.results;
		const movie = results[0];
		const { title, overview, backdrop_path, poster_path, release_date, genre_ids, id } = movie;
		const genreResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
		const genres = genreResponse.data.genres;
		const genreNames = genre_ids.map(id => {
		  const genre = genres.find(genre => genre.id === id);
		  return genre.name;
		});
		const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`);
		const details = detailsResponse.data;
		const trailerKey = details.videos.results[0].key;
		const duration = details.runtime;
		const responseObj = {
		  title: title,
		  overview: overview,
		  backdrop_path: `https://image.tmdb.org/t/p/original${backdrop_path}`,
		  poster_path: `https://image.tmdb.org/t/p/original${poster_path}`,
		  trailer: `https://www.youtube.com/watch?v=${trailerKey}`,
		  video: `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`,
		  release_date: release_date,
		  duration: duration,
		  genre: genreNames.join(', ')
		};
		const savedMovie = await Movie.create(responseObj);
		res.send(savedMovie);
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).send('Error fetching movie data');
	}
  });
  

  
  //Batch
  router.post('/batch', async (req, res) => {
	const { names } = req.body;
	try {
	  const results = [];
	  for (const name of names) {
		const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${name}`);
		const movie = response.data.results[0];
		if (!movie) {
		  console.log(`No movie found for ${name}`);
		  continue;
		}
		const { title, overview, backdrop_path, poster_path, release_date, genre_ids, id } = movie;
		if (!title || !overview || !backdrop_path || !poster_path || !release_date || !genre_ids || !id) {
		  console.log(`Missing data for ${name}`);
		  continue;
		}
		const genreResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
		const genres = genreResponse.data.genres;
		const genreNames = genre_ids.map(id => {
		  const genre = genres.find(genre => genre.id === id);
		  return genre.name;
		});
		const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`);
		const details = detailsResponse.data;
		const trailerKey = details.videos.results.find(video => video.type === 'Trailer')?.key;
		if (!trailerKey) {
		  console.log(`Trailer not available for ${name}`);
		  continue;
		}
		const duration = details?.runtime;
		const movieObj = {
		  title: title,
		  overview: overview,
		  backdrop_path: `https://image.tmdb.org/t/p/original${backdrop_path}`,
		  poster_path: `https://image.tmdb.org/t/p/original${poster_path}`,
		  trailer: trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : '',
		  video: `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`,
		  release_date: release_date,
		  duration: duration || '',
		  genre: genreNames.join(', ')
		};
		results.push(movieObj);
	  }
	  const savedMovies = await Movie.create(results);
	  res.send(savedMovies);
	} catch (error) {
	  console.error(error);
	  res.status(500).send('Error fetching movie data');
	}
  });
  router.delete('/without-trailer', async (req, res) => {
	try {
		const movies = await Movie.find({ trailer: { $exists: true, $ne: '' } });
		for (const movie of movies) {
		  if (!movie.trailer) {
			await Movie.findByIdAndDelete(movie._id);
		  }
		}
		res.send('Deleted movies without trailers');
	  } catch (error) {
		console.error(error);
		res.status(500).send('Error deleting movies without trailers');
	  }
	  
  });
	
  
// Update Method
router.put("/:id",async (req,res)=>{

	try {
		const UpdatedMovie= await Movie.findByIdAndUpdate(req.params.id,{$set	:req.body},{
			new:true
		})  ;
		res.status(200).json(UpdatedMovie);
	} catch (error) {
		res.status(500).json(error);
	}
});



// Delete Method
router.delete("/:id",async (req,res)=>{

	try {
await Movie.findByIdAndDelete(req.params.id);
		res.status(200).json("The movie is Deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});
router.delete("/reviews/:id", async (req, res) => {
	try {
	  const deletedReview = await Review.findByIdAndDelete(req.params.id);
	  if (!deletedReview) {
		return res.status(404).json({ message: "Review not found" });
	  }
	  res.status(200).json({ message: "Review deleted successfully" });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  });
  
// Get Method
router.get("/find/:id",async (req,res)=>{

	try {
		const movie=
await Movie.findById(req.params.id);
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get All Method
router.get("/",async (req,res)=>{

	try {
		const movie=
await Movie.find();
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});
router.get("/movies/review",async (req,res)=>{

	try {
		const movie=
await Review.find();
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get Random Method
router.get("/random",async (req,res)=>{
const type=req.query.type;
	let movie;
		
	try {
if(type=="series"){
	movie=await Movie.aggregate([{
		$match:{isSeries:true}},
 {$sample:{size:1}},]);
}
else{
movie=await Movie.aggregate([{
$match:{isSeries:false}},
 {$sample:{size:1}},]);
		}


		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.post("/batch", async (req, res) => {
	const movies = req.body;
	try {
	  const savedMovies = await Movie.insertMany(movies);
	  res.status(201).json(savedMovies);
	} catch (error) {
	  res.status(500).json(error);
	}
  });
  // Search Method
router.get("/search", async (req, res) => {
	const keyword = req.query.keyword;
	try {
	  const movies = await Movie.find({
		$or: [
		  { title: { $regex: keyword, $options: "i" } },
		  { description: { $regex: keyword, $options: "i" } },
		],
	  });
	  res.status(200).json(movies);
	} catch (error) {
	  res.status(500).json(error);
	}
  });
  
module.exports=router;
