var express = require('express');
var router = express.Router();
var passport = require('../app').passport;
var BlogHandler = require('../services/blogHandler');

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
};

/* -------------------- GET Request Handlers -------------------- */

/* GET login page. */
router.get('/', function(req, res) {
    if (req.isAuthenticated()){
        // If already logged in then render Home Page
        res.redirect('/home');
    }
    else{
        // Display the Login page with any flash message, if any
        res.render('login', { message: req.flash('message') });
    }
});

/* GET Registration Page */
router.get('/signup', function(req, res){
    res.render('signup',{message: req.flash('message')});
});

/* GET Home Page */
router.get('/home', isAuthenticated, function(req, res){
    BlogHandler.list5Blogs(req, res);
    //res.render('home', { user: req.user });
});

/* GET More blogs on Home Page */
router.get('/home/more', isAuthenticated, function(req, res){
    BlogHandler.moreBlogs(req, res);
    //res.render('home', { user: req.user });
});

/* GET Blog-content Page */
var BlogContentHandler = require('../services/blogContentHandler');
router.get('/blog-content/:id', isAuthenticated, function(req, res){
    BlogContentHandler.getBlogbyId(req, res);
});

/* GET Add New Blog Page */
router.get('/blog-new', isAuthenticated, function(req, res){
    res.render('blog-new', { user: req.user });
});

/* GET Add New To-Do Page */
router.get('/todo', isAuthenticated, function(req, res){
    res.render('todo', { user: req.user });
});

/* Handle Logout */
var signout = require('../services/signout');
router.get('/signout', function(req, res) {
    signout(req, res);
});

/* Get Users Status */
/* This is a rest api. So that it can be used with ajax*/
var usersStatus = require('../services/usersStatus');
router.get('/status', isAuthenticated, function (req, res) {
    usersStatus.getUserStatus(req, res);
});


/* -------------------- POST Request Handlers -------------------- */

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true
}));

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
}));

/* Handle Add New Blog POST */
router.post('/blog/new', isAuthenticated, function(req, res, next){
    BlogHandler.addNewBlog(req,res);
    console.dir(req.files);
});

/* Handle Add New Comment */
router.post('/blog-content/comment/:id', isAuthenticated, function(req, res, next){
    BlogContentHandler.addCommentByID(req, res);
});

module.exports = router;
