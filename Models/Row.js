const mongoose	=require('mongoose');
const RowSchema=new mongoose.Schema({
	title:{type:String ,required:true,unique:true},
	type:{type:String},
	
	genre:{type:String},
	content:{type:Array},
	
},
{timeStamps:true})	;
module.exports=mongoose.model("Row",RowSchema);