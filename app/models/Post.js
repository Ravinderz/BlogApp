var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('post', new Schema({
	title : String,
	description : String,
	author : String,
	content : String,
	likes : Number,
	likedBy : [{type:Schema.Types.ObjectId,ref:'User'}],
	createdTime : {type : Date,default: Date.now()},
	updatedTime : {type : Date, default: Date.now()},
	tags : [String],
	isActive : {type:Boolean,default:true},
	
	comments :[{comment : String,
				commentBy : String,
				likes: {type:Number,default:0},
				likedBy : [{type: Schema.Types.ObjectId,ref:'User'}],
				isActive : {type:Boolean,default:true},
				time : {type:Date,default : Date.now()}
			  }]
}));