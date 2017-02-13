var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('post', new Schema({
	title : String,
	description : String,
	author : String,
	content : String,
	likes : Number,
	createdTime : {type : Date, default: Date.now},
	tags : [String],
	isActive : Boolean,
	comments :[{comment : String,
				commentBy : String,
				time : {type:Date,default : Date.now},
				likes : Number
			  }]
}));