'use strict';

var mongoose = require('mongoose');
var db2 = mongoose.createConnection(process.env.MONGO_URI||"mongodb://localhost:27017/votes",{ storage: { smallFiles: true } });
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
exports.db = db2;
//exports model
module.exports = db2.model('Vote', vote);
