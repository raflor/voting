'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User_google = new Schema({
	google: {
		id: String,
		displayName: String,
		username: String,
	},
   votes: {
      vote_id: Number
   }
});

module.exports = mongoose.model('User', User_google);
