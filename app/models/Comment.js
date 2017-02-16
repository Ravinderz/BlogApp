var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('comment', new Schema({
	comment : String,
	commentBy : String,
	likes: {type:Number,default:0},
	time : {type : Date,default: Date.now},
	isActive : {type:Boolean,default: true}
}));