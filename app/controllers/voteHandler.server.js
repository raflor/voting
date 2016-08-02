'use strict';

var vote = require('../models/vote.js');
var db = vote.db;
var coll = db.collection('votes');

function voteHandler() {
    
    
    this.getVotes = function(callback) {
        coll.find({}, function(err, cursor){
            if (err) {
                    throw err;
                }
            cursor.toArray(function(err, result) {
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
        update.$inc["votes."+value] = 1;
        //console.log(update);
        vote.findOneAndUpdate({name:req.body.name}, update, {upsert:true, new : true, strict:false}, function(err, result){
            if (err) {
                    throw err;
                }
            //console.log(result);
            res.json(result);
        });
    };
    
    this.addPoll = function(req, res){
        var poll = new vote.vote({name:req.body.name});
        req.body.choices.forEach(function(item, index){
            poll.votes.push({choice:item.choice,votes:1});
        });
        poll.save(function(err){
            if(err) throw err;
        });
        //res = ?
    };
}
module.exports = voteHandler;