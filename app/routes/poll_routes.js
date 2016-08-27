'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var bodyParser = require('body-parser');

module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/login');
        }
    }

    var voteHandler = new VoteHandler();

    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));

    app.set('view engine', 'pug');

    app.route('/vote/:id')
        .get(function(req, res) {
            voteHandler.findVote(req, function(result) {
                res.render('vote', {
                    poll: result,
                    auth: req.isAuthenticated()
                });
            });
        });
        
    app.get('/vote/api/user_data', function(req, res) {
        if (req.user === undefined) {
            // The user is not logged in
            res.json({});
        }
        else {
            res.json({
                user: req.user
            });
        }
    });

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
        });

    app.route('/myvotes')
        .get(isLoggedIn, function(req, res) {
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

    app.route('/addvote/api/:id')
        .post(voteHandler.addPoll);

    app.route('/editpoll/api/:id')
        .post(voteHandler.editPoll);

    app.route('/deletepoll/api/:id')
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