/**
 * Created by Nandeesh H D on 20-10-2014.
 */

var mongoose = require('mongoose');


module.exports = mongoose.model('User',{
    id: Number,
    username: String,
    password: String,
    videochaturl: String,
    status: String,
    todo: {type: Array, default: []}
});

//todo:{taskname: String, date: {type: Date, default: Date.now}}

