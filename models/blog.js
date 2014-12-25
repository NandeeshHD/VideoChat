/**
 * Created by Sundresh H D on 21-10-2014.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('Blog',{
    id: Number,
    title: String,
    date: Date,
    content: String,
    author: String,
    picture: String,
    comments: {type: Array, default: []}
});