'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user_google = new Schema({
	google: {
		id: String,
		displayName: String,
		username: String,
	}
});

module.exports = mongoose.model('user', user_google);
