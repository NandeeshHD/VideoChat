var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var crypto = require("crypto");

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            //console.log('inside login------------------------'+username+'----'+password);
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        //create user ID for new user
                        User.find({}).select('id').sort('-id').limit(1).exec(function(err, id){
                            //console.log('ID--- '+id[0] +'  TypeOf-- '+ typeof (id[0]));
                            var userId;
                            if (err) {
                                throw err;
                            }
                            else {
                                if(typeof id != "undefined" && id != null && id.length > 0) {
                                    saveNewUser(id[0].id + 1);
                                }
                                else {
                                    saveNewUser(1);
                                }
                            }

                            function saveNewUser(id) {
                                // set the user's local credentials
                                newUser.id = id;
                                newUser.username = username;
                                newUser.password = createHash(password);
                                //newUser.videochaturl = 'videochat/' + crypto.randomBytes(10).toString('hex');
                                newUser.videochaturl = crypto.randomBytes(10).toString('hex');
                                newUser.status = 'online';
                                newUser.todo = [];

                                // save the user
                                newUser.save(function (err) {
                                    if (err) {
                                        console.log('Error in Saving user: ' + err);
                                        throw err;
                                    }
                                    console.log('User Registration succesful');
                                    return done(null, newUser);
                                });
                            }
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}