'use strict';

var mongoose = require('mongoose');
var db1 = mongoose.createConnection(process.env.MONGO_URI||"mongodb://localhost:27017/",{ storage: { smallFiles: true } });
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
      publicRepos: Number
	},
   nbrClicks: {
      clicks: Number
   }
});
exports.db = db1;
module.exports = db1.model('User', User);
