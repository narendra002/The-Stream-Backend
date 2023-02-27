const express=require("express");
const router=express.Router();
const Movie =require("../Models/Movie.js");


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
  
module.exports=router;