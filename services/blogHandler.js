/**
 * Created by Sundresh H D on 23-10-2014.
 */

var Blog = require("../models/blog"),
    crypto = require("crypto"),
    fs = require("fs");


module.exports = {
    count: 0,

    listAllBlogs: function(req, res){
        Blog.find({}, function(error, allBlogs){
            if (error) throw error;
            console.log('List of all blogs ' + allBlogs);
        });
    },

    list5Blogs: function(req, res){
        var query = Blog.find({});
        query.limit(5);
        //query.skip(this.count);
        this.count = this.count + 5;

        query.exec(function(error, Blogs){
            if (error) {throw error}
            else{
                Blog.find({}).sort('-id').limit(5).exec(function(err, recentBlogs) {
                    if (error) {
                        throw error
                    }
                    else {
                        res.render('home', { user: req.user, blogs: Blogs, recent: recentBlogs});
                        console.log({ user: req.user, blogs: Blogs, recent: recentBlogs});
                    }
                });
            }
        })
    },

    moreBlogs: function(req, res){
        var query = Blog.find({});
        query.limit(5);
        query.skip(this.count);
        this.count = this.count + 5;

        query.exec(function(error, Blogs){
            if (error) {throw error}
            else{
                Blog.find({}).sort('-id').limit(5).exec(function(err, recentBlogs) {
                    if (error) {
                        throw error
                    }
                    else {
                        if(Blogs.length > 0){
                            res.render('home', { user: req.user, blogs: Blogs, recent: recentBlogs});
                            console.log({ user: req.user, blogs: Blogs, recent: recentBlogs});
                        } else {
                            res.redirect('/home');
                        }
                    }
                });
            }
        })
    },

    addNewBlog: function(req, res, next){
        var newBlog = new Blog();

        //create blog ID for new blog
        Blog.find({}).select('id').sort('-id').limit(1).exec(function(err, id){
            //console.log('ID--- '+id[0] +'  TypeOf-- '+ typeof (id[0]));
            var userId;
            if (err) {
                throw err;
            }
            else {
                if(typeof id != "undefined" && id != null && id.length > 0) {
                    saveNewBlog(id[0].id + 1);
                }
                else {
                    saveNewBlog(1);
                }
            }
            function saveNewBlog(id) {
                // set the blog's values
                newBlog.id = id;
                newBlog.title = req.body.title;
                newBlog.date = new Date();
                newBlog.content = req.body.content;
                newBlog.author = req.user.username;
                newBlog.picture = handleFileUpload(req);

                // save the blog
                newBlog.save(function (err) {
                    if (err) {
                        console.log('Error in Saving blog: ' + err);
                        throw err;
                    }
                    console.log('New Blog saved successfully');
                });
            }
            function handleFileUpload(req) {
                if(!req.files || !req.files.picture || !req.files.picture.name) {
                    console.log('inside if...........');
                    return req.body.currentPicture || '';
                }
                var data = fs.readFileSync(req.files.picture.path);
                var fileName = req.files.picture.originalname;
                var uid = crypto.randomBytes(10).toString('hex');
                var dir = __dirname + "/../public/uploads/" + uid;
                fs.mkdirSync(dir, '0777');
                fs.writeFileSync(dir + "/" + fileName, data);
                return '/uploads/' + uid + "/" + fileName;
            }
        });
        res.redirect('/home');
    }

};