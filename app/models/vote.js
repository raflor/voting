'use strict';

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/votes');
var Schema = mongoose.Schema;

var vote = db.model('Vote',new Schema({
	name: String,
	votes:{
		yae: Number,
		nay: Number
	}
}));
exports.db = db;
module.exports = db.model('Vote', vote);
