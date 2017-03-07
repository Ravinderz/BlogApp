var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
	firstName : String,
	lastName : String,
	email : String,
	password : String,
	phone : {type:Number},
	validateToken : String,
	isActive : {type:Boolean , default:false}
}));