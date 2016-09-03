'use strict';

var vote = require('../models/vote.js');
var user = require('../models/users.js');
var db = vote.db;
var votes = db.collection('votes');
var users = user.db.collection('users');
var ObjectId = require('mongoose').Types.ObjectId;
var mongoose = require('mongoose');

function voteHandler() {

    // search for polls with optional parameter
    this.getVotes = function(param, callback) {
        votes.find(param, function(err, cursor) {
            if (err) {
                throw err;
            }
            cursor.sort({
                "_id": -1
            }).toArray(function(err, result) {
                if (err) {
                    throw err;
                }
                callback(result);
            });
        });
    };

    //search for single Vote
    this.findVote = function(req, callback) {
        vote.findById((req.params.id), function(err, doc) {
            if (err) {
                throw err;
            }
            callback(doc);
        });
    };

    // add one vote
    this.addVotes = function(req, res) {
        var value = req.body.value;
        var update = {
            $inc: {}
        };
        update.$inc["choices.$.votes"] = 1;
        vote.findOneAndUpdate({
            _id: ObjectId(req.body.id),
            "choices._id": ObjectId(value)
        }, update, {
            upsert: true,
            new: true,
            strict: false
        }, function(err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    };

    //edit poll
    this.editPoll = function(req, res) {
        if(!req.body.value){
            res.status(400).end();
            return;
        }
        //find poll to edit
        vote.findById((req.body.id), function(err, doc) {
            if (err) throw err;
            // check if entries match with request
            doc.choices.forEach(function(item) {
                var curr = req.body.value.find(function(choice, index) {
                    if (choice.name == item._id) {
                        req.body.value.splice(index, 1);
                        return choice;
                    }
                });
                // update matched entries
                if (curr) {
                    vote.update({
                        _id: ObjectId(req.body.id),
                        choices: {
                            _id: ObjectId(curr.name)
                        }
                    }, {
                        $set: {
                            "choices.$.choice": curr.value
                        }
                    });
                }
                // delete other entries
                else {
                    console.log(item.id)
                    doc.choices.id(item.id).remove();
                }

            });
            // add new entries
            req.body.value.forEach(function(item, index) {
                if (item.value != '') {
                    doc.choices.push({
                        choice: item.value,
                        votes: 0
                    });
                }
            });
            doc.save(function(err) {
                if (err) throw err;
            });

            // change title
            vote.update({
                _id: ObjectId(req.body.id)
            }, {
                $set: {
                    "name": req.body.name.value
                }
            });
            res.json(doc);
        });

    };

    this.addPoll = function(req, res) {
        var poll = new vote({
            name: req.body.name,
            user_id: "1"
        });
        req.body.value.forEach(function(item, index) {
            poll.choices.push({
                choice: item.value,
                votes: 0
            });
        });
        poll.save(function(err) {
            if (err) throw err;
            res.status(204).end();
        });
    };

    this.deletePoll = function(req, res) {
        votes.remove({
            _id: ObjectId(req.body.id)
        }, function(err, result) {
            if (err) res.status(500).end();
            res.status(204).end();
        });
    };
    
    this.getUser = function(req, res) {
        if(req.user){
            if(req.user.github){
                res.json(req.user.github);
            }
            else{
                res.json(req.user.google);
            }
        }
        
    };
    //depreciated
    this.findVotes = function(user, callback) {
        votes.find({
            "user_id": user.github.id
        }, function(err, cursor) {
            if (err) {
                throw err;
            }
            cursor.sort({
                "_id": -1
            }).toArray(function(err, result) {
                if (err) {
                    throw err;
                }
                callback(result);
            });
        });

    };
}
module.exports = voteHandler;