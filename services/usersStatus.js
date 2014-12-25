/**
 * Created by Sundresh H D on 24-10-2014.
 */
var User = require('../models/user');

module.exports = {
    getUserStatus: function (req, res) {
        User.find({status : 'online'}).where('username').ne(req.user.username).limit(10).exec(function (err, onlineUsers) {
            if(err){ throw err; }
            else {
                User.find({status: 'offline'}).where('username').ne(req.user.username).limit(10).exec(function (err, offlineUsers) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log({online: onlineUsers, offline: offlineUsers});
                        res.send({online: onlineUsers, offline: offlineUsers});
                    }
                })
            }
        })
    }
};