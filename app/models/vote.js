'use strict';

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/votes');
var Schema = mongoose.Schema;

var childSchema = new Schema({
		choice: String,
		votes: Number
	
});

var vote = new Schema({
	name: String,
	choices:[childSchema]
});
exports.db = db;
module.exports = db.model('Vote', vote);
