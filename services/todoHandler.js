/**
 * Created by Sundresh H D on 07-01-2015.
 */
var User = require('../models/user');

module.exports = {
    addTask: function(req, res){
        var username = req.user.username;
        //console.log({username: username, name: req.body.taskname, comment: req.body.comment});
        User.findOneAndUpdate({username: username}, {$push: {todo: {taskname: req.body.taskname, comment: req.body.comment}}}, function(err, user){
            if (err) { throw err; }
            else{
                //console.log(user);
                User.findOne({username: username}, 'todo', function(err, todo){
                    //console.log(todo);
                    res.send({'todo' : todo.todo});
                });
            }
        });
    }
};