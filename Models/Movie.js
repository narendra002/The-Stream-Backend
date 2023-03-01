const mongoose	=require('mongoose');
const MovieSchema=new mongoose.Schema(
	{
	title:{type:String ,required:true,unique:true},
	overview:{type:String},
	backdrop_path:{type:String},
	poster_path:{type:String},
	trailer:{type:String},
	video:{type:String},
	first_air_date:{type:String},
	limit:{type:String},
	genre:{type:String},
	
	
},
{timeStamps:true});
module.exports=mongoose.model("Movie",MovieSchema);