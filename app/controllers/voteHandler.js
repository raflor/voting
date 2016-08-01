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
        vote.findOneAndUpdate({name:req.body.name}, update, {upsert:true,new : true}, function(err, result){
            if (err) {
                    throw err;
                }
            res.json(result);
        });
    };
}
module.exports = voteHandler;