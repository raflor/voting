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
        console.log(req.body);
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
        var poll = new vote({name:req.body.name});
        //console.log(req.body);
        req.body.value.forEach(function(item, index){
            poll.choices.push({choice:item.value,votes:1});
        });
        poll.save(function(err){
            if(err) throw err;
        });
        //res = ?
    };
}
module.exports = voteHandler;