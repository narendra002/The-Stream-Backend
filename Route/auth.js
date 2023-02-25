const express=require("express");
const router=express.Router();
const User =require("../Models/User.js");
const CryptoJS = require("crypto-js");
const jwt =require('jsonwebtoken')
router.post("/register",async (req,res)=>{
	const newUser=new User ({
		
		username:req.body.username,
		email:req.body.email,
		isAdmin:req.body.isAdmin,
		password:
		CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),});

	try {
		const savedUser= await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json(error);
	}
	 
});





// Login
router.post("/login",async (req,res)=>{
	try {
		
		const user=await User.findOne({email:req.body.email});
		!user && res.status(401).json("Wrong password or username!");


	const	bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

originalPassword!==req.body.password &&res.status(401).json("Wrong password or username!");

const accessToken=jwt.sign({
id:user._id, isAdmin: user.isAdmin
},
process.env.SECRET,
{expiresIn:"30d"}
);
const {password, ...info}=user._doc;


		
		res.status(201).json({...info,accessToken});
	} catch (error) {
		res.status(500).json(error);
	}
	 
});









module.exports=router;