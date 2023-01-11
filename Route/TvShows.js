const express=require("express");
const router=express.Router();
const TvShow =require("../Models/TvShow.js");


// Create Method
router.post("/",async (req,res)=>{
	const newTvShow=new TvShow (req.body);
	try {
		const savedTvShow= await newTvShow.save();
		res.status(201).json(savedTvShow);
	} catch (error) {
		res.status(500).json(error);
	}
	 
});

// Update Method
router.put("/:id",async (req,res)=>{

	try {
		const UpdatedTvShow= await TvShow.findByIdAndUpdate(req.params.id,{$set	:req.body},{
			new:true
		})  ;
		res.status(200).json(UpdatedTvShow);
	} catch (error) {
		res.status(500).json(error);
	}
});



// Delete Method
router.delete("/:id",async (req,res)=>{

	try {
await TvShow.findByIdAndDelete(req.params.id);
		res.status(200).json("The movie is Deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get Method
router.get("/find/:id",async (req,res)=>{

	try {
		const tvShow=
await TvShow.findById(req.params.id);
		res.status(200).json(tvShow);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get All Method
router.get("/",async (req,res)=>{

	try {
		const tvShow=
await TvShow.find();
		res.status(200).json(tvShow);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get Random Method
router.get("/random",async (req,res)=>{
const type=req.query.type;
	let tvShow;
		
	try {
if(type=="series"){
	tvShow=await TvShow.aggregate([{
		$match:{isSeries:false}},
 {$sample:{size:1}},]);
}
else{
    tvShow=await TvShow.aggregate([{
$match:{isSeries:true}},
 {$sample:{size:1}},]);
		}


		res.status(200).json(TvShow);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports=router;