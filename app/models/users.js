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
var user_google = new Schema({
	google: {
		id: String,
		displayName: String,
		username: String,
	}
});
exports.db = db1;
module.exports = {
    user_github:db1.model('user_github', User,'users'),
    user_google:db1.model('user_google',user_google,'users')
};
