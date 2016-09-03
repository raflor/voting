'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var session = require('express-session');

module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            req.session.returnTo = req.path; 
            res.redirect('/login');
        }
    }

    var voteHandler = new VoteHandler();

    app.set('view engine', 'pug');
    
    // display single poll
    app.route('/vote/:id')
        .get(function(req, res) {
            voteHandler.findVote(req, function(result) {
                res.render('vote', {
                    poll: result,
                    auth: req.isAuthenticated()
                });
            });
        });
        
    // display all votes
    app.route('/vote')
        .get(function(req, res) {
            var param = {};
            voteHandler.getVotes(param, function(results) {
                res.render('home', {
                    polls: results,
                    auth: req.isAuthenticated(),
                    filter: false
                });
            });
        })
        .post(function(req, res){
            var param = {name: req.body.value};
            voteHandler.getVotes(param, function(results) {
                res.render('home', {
                    polls: results,
                    auth: req.isAuthenticated(),
                    filter: false
                });
            });
        });
    
    
    app.route('/myvotes')
        .get(isLoggedIn, function(req, res) {
            //console.log(req.session);
            var param = {"user_id": req.user.github.id};
            voteHandler.getVotes(param, function(results) {
                res.render('myvotes', {
                    polls: results,
                    auth: req.isAuthenticated()
                });
            });
        });

    app.route('/addvote')
        .get(isLoggedIn, function(req, res) {
            res.render('add', {
                auth: req.isAuthenticated()
            });
        });

    app.route('/addvote/api/')
        .post(voteHandler.addPoll);

    app.route('/editpoll/api/')
        .post(voteHandler.editPoll);

    app.route('/deletepoll/api/')
        .post(voteHandler.deletePoll);

    app.route('/vote/api')
        .post(voteHandler.addVotes);

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/userinfo.profile']
        }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/vote');
        });
};