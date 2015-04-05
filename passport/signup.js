var LocalStrategy   = require('passport-local').Strategy;
var models = require('../bookshelf/models');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {

      findOrCreateUser = function(){
				models.User.forge({ username: username })
		    .fetch({ withRelated: ['rides', 'requests'] })
		    .then(function (user) {
					console.log('User already exists with username: '+ username);
					return done(null, false, req.flash('message','User Already Exists'));
		    })
		    .otherwise(function (err) {

					models.User.forge({
			      username: username,
			      email: req.param('email'),
						password: createHash(password)
			    })
			    .save()
			    .then(function (user) {
						console.log('User Registration successful');
						return done(null, newUser);
			    })
			    .otherwise(function (err) {
						console.log('Error in Saving user: '+ err);
			      return done(err, false);
			    });

		    });
      };

      process.nextTick(findOrCreateUser);
    })
  );

  var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }
}
