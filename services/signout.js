/**
 * Created by Sundresh H D on 23-10-2014.
 */
var User = require('../models/user');

module.exports = function(req, res){
    User.update({ 'username' :  req.user.username }, {$set: {status: 'offline'}}, function(err, user){
        if(err){ throw err }
        else {
            console.log(user.username + ' is now ' + user.status);
            req.logout();
            res.redirect('/');
        }
    });
};