var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('post', new Schema({
	title : String,
	description : String,
	author : String,
	content : String,
	likes : Number,
	createdTime : {type : Date},
	updatedTime : {type : Date, default: Date.now},
	tags : [String],
	isActive : Boolean,
	
	comments :[{comment : String,
				commentBy : String,
				likes: {type:Number,default:0},
				isActive : {type:Boolean,default:true},
				time : {type:Date,default : Date.now}
			  }]
}));