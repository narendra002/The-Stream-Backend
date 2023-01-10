const express=require("express");
const router=express.Router();
const List =require("../Models/Row.js");




//Create Method
router.post("/",async (req,res)=>{
	const newList=new List (req.body);
	try {
		const savedList= await newList.save();
		res.status(201).json(savedList);
	} catch (error) {
		res.status(500).json(error);
	}
	 
});


// Delete Method
router.delete("/:id",async (req,res)=>{

	try {
await List.findByIdAndDelete(req.params.id);
		res.status(200).json("The movie is Deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});



// Update Method
router.put("/:id",async (req,res)=>{

	try {
		const UpdatedList= await List.findByIdAndUpdate(req.params.id,{$set	:req.body},{
			new:true
		})  ;
		res.status(200).json(UpdatedList);
	} catch (error) {
		res.status(500).json(error);
	}
});

// // Get Method
// router.get("/find/:id",async (req,res)=>{

// 	try {
// 		const list=
// await List.findById(req.params.id);
// 		res.status(200).json(list);
// 	} catch (error) {
// 		res.status(500).json(error);
// 	}
// });

// // Get All Method
// router.get("/",async (req,res)=>{

// 	try {
// 		const list=
// await List.find();
// 		res.status(200).json(list);
// 	} catch (error) {
// 		res.status(500).json(error);
// 	}
// });



// Get Random Method
router.get("/",async (req,res)=>{
const typeQuery=req.query.type;
	const genreQuery=req.query.genre;
	let list=[];
		
				try {
			if(typeQuery){
              if(genreQuery){
				
				list=await List.aggregate([{
					$match:{type:typeQuery,genre:genreQuery}},
			 {$sample:{size:10}},]);
			}else{
				list=await List.aggregate([{
					$match:{type:typeQuery}},
			 {$sample:{size:10}},]);
			}
			}
			else{
			list=await List.aggregate([
			 {$sample:{size:10}}]);
			
			
			}
			
			
		res.status(200).json(list);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports=router;