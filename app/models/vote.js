'use strict';

var mongoose = require('mongoose');
var db = mongoose.createConnection(process.env.MONGO_URI);
var Schema = mongoose.Schema;

var childSchema = new Schema({
		choice: String,
		votes: Number
	
});

var vote = new Schema({
	name: String,
	user_id: String,
	choices:[childSchema]
});
exports.db = db;
//exports model
module.exports = db.model('Vote', vote);
