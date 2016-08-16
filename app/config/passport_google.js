'use strict';

var GoogleStrategy = require('passport-google').Strategy;
var User = require('../models/user_google');
var configAuth = require('./auth');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	//var passport = require('passport');
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

	// Use the GoogleStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and Google
	//   profile), and invoke a callback with a user object.
	passport.use(new GoogleStrategy({
			clientID: "980646013282-mk5qk8l2kq7bpkt14f4s80g1gbodi1nt.apps.googleusercontent.com",
			clientSecret: "YyjbFx_TyjTBMKE7xVfZjy0Z",
			callbackURL: "http://voting-app-raflor.c9users.io/auth/google/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ 'google.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.google.id = profile.id;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		}
	));
};
