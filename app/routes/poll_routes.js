'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.js');
var bodyParser = require('body-parser');

module.exports = function(app, passport) {
    var voteHandler = new VoteHandler();

    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));

    app.set('view engine', 'pug');

    app.route('/vote')
        .get(function(req, res) {
            voteHandler.getVotes(function(results) {
                res.render('home', {
                    polls: results
                });
            });
        });


    app.route('/vote/api')
        .post(voteHandler.addVotes);
};