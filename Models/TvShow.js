const mongoose	=require('mongoose');
const TvShowSchema=new mongoose.Schema(
	{
	title:{type:String ,required:true,unique:true},
	overview:{type:String},
	backdrop_path:{type:String},
	poster_path:{type:String},
	trailer:{type:String},
	content:{type:Array},
	first_air_date:{type:String},
	genre:{type:String},
    season:{type:Number},
    episodes:{type:Number},
	isSeries:{type:Boolean,default:false},
	
},
{timeStamps:true});
module.exports=mongoose.model("TvShow",TvShowSchema);