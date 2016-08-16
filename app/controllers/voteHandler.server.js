'use strict';

var vote = require('../models/vote.js');
var user = require('../models/users.js');
var db = vote.db;
var votes = db.collection('votes');
var users = user.db.collection('users');

function voteHandler() {
    
    this.getVotes = function(callback) {
        votes.find({}, function(err, cursor){
            if (err) {
                    throw err;
                }
            cursor.sort({"_id":-1}).toArray(function(err, result) {
                if (err) {
                    throw err;
                }
                callback(result);
            });
        });
            
    };
    
    this.findVotes = function(user, callback) {
        votes.find({"user_id":user.github.id}, function(err, cursor){
            if (err) {
                    throw err;
                }
            cursor.sort({"_id":-1}).toArray(function(err, result) {
                if (err) {
                    throw err;
                }
                callback(result);
            });
        });
            
    };

    this.addVotes = function(req, res) {
        var value = req.body.value;
        var update = {$inc:{}};
        update.$inc["choices.$.votes"] = 1;
        console.log(req);
        console.log(update);
        vote.findOneAndUpdate({_id:req.body.id, "choices.choice":value}, update, {upsert:true, new : true, strict:false}, function(err, result){
            if (err) {
                    throw err;
                }
            //console.log(result);
            res.json(result);
        });
    };
    
    this.addPoll = function(req, res){
        var poll = new vote({name:req.body.name,user_id:req.user.github.id});
        //console.log(req);
        req.body.value.forEach(function(item, index){
            poll.choices.push({choice:item.value,votes:0});
        });
        poll.save(function(err){
            if(err) throw err;
        });
        //res = ?
    };
}
module.exports = voteHandler;