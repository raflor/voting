'use strict';

var vote = require('../models/vote.js');
//var user = require('../models/users.js');
var db = vote.db;
var votes = db.collection('votes');
//var users = user.db.collection('users');
var ObjectId = require('mongoose').Types.ObjectId;
var mongoose = require('mongoose');
function voteHandler() {
    
    this.getVotes = function(param,callback) {
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
    //for single Votes
    this.findVote = function(req, res) {
        vote.findById((req.body.id), function(err, doc) {
            if (err) {
                throw err;
            }
            res.json(doc);
        });

    };
    
    //
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

    this.addVotes = function(req, res) {
        var value = req.body.value;
        var update = {
            $inc: {}
        };
        update.$inc["choices.$.votes"] = 1;
        vote.findOneAndUpdate({
            _id: req.body.id,
            "choices._id": value
        }, update, {
            upsert: true,
            new: true,
            strict: false
        }, function(err, result) {
            if (err) {
                throw err;
            }
            //console.log(result);
            res.json(result);
        });
    };

    this.editPoll = function(req, res) {
        vote.findById((req.body.id), function(err, doc) {
            if (err) throw err;
            console.log(req.body);
            console.log(doc.choices);
            doc.choices.forEach(function(item) {
                var curr = req.body.value.find(function(choice, index) {
                    if (choice.name == item._id) {
                        req.body.value.splice(index, 1);
                        return choice.name;
                    }
                });
                //console.log(curr);
                if (curr) {
                    console.log('curr');
                    console.log(curr);
                    votes.update({
                        _id: ObjectId(req.body.id),
                        "choices._id": ObjectId(curr.name)
                    }, {
                        $set: {
                            "choices.$.choice": curr.value
                        }
                    });
                }
                else {
                    vote.update(
                        {},
                        {$pull: {choices:{_id:ObjectId(item._id)}}},
                        function(err, result){
                            if(err) throw err;
                            console.log(result);
                        }
                    );
                }

            });
            console.log(req.body.value);
            req.body.value.forEach(function(item, index) {
                if(item.value != ''){
                    doc.choices.push({
                        choice: item.value,
                        votes: 0
                    });
                }
            });
            doc.save(function(err) {
                if (err) throw err;
            });
            res.json(doc);
        });
        
    };

    this.addPoll = function(req, res) {
        var poll = new vote({
            name: req.body.name,
            user_id: req.user.github.id
        });
        //console.log(req);
        req.body.value.forEach(function(item, index) {
            poll.choices.push({
                choice: item.value,
                votes: 0
            });
        });
        poll.save(function(err) {
            if (err) throw err;
        });
        //res = ?
    };

    this.deletePoll = function(req, res) {
        console.log(req.body);
        votes.remove({_id: ObjectId(req.body.id)},function(err, result){
            if(err) res.status(500);
            res.status(204);
        });
    };
}
module.exports = voteHandler;