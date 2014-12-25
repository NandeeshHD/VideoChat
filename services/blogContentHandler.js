/**
 * Created by Sundresh H D on 24-10-2014.
 */
var Blog = require("../models/blog");

module.exports = {
    getBlogbyId: function(req, res){
        var id = req.params.id;
        Blog.findOne({id: id}, function(err, blog){
            if (err){ throw err; }
            else{
                Blog.find({}).sort('-id').limit(5).exec(function(err, recentBlogs) {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.render('blog-content', { user: req.user, blog: blog, recent: recentBlogs});
                        console.log({ user: req.user, blog: blog, recent: recentBlogs});
                    }
                });
            }
        })
    },

    addCommentByID: function(req, res){
        var id = req.params.id;
        //console.log({name: req.body.name, comment: req.body.comment});
        Blog.findOneAndUpdate({id: id}, {$push: {comments: {name: req.body.name, comment: req.body.comment}}}, function(err, blog){
            if (err) { throw err; }
            else{
                //console.log(blog);
                Blog.findOne({id: id}, 'comments', function(err, comments){
                    //console.log(comments.comments);
                    res.send({'comments' : comments.comments});
                });
            }
        });
    }
};