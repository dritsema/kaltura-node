
	'use strict';

/**
 * Module dependencies.
 */

module.exports = function (app) {
  // User Routes
  var 	config = require('../config/properties.loader'),
  		passport = require('passport');
  //auth = require('../controllers/auth.controller');


  // Setting up the users authentication api
  	app.get("/login",
		passport.authenticate(config.passport.strategy,
		{
			successRedirect : "/",
			failureRedirect : "/login",
		})
	);

	app.post('/login/callback',
		passport.authenticate(config.passport.strategy,
			{
				failureRedirect: '/error',
				failureFlash: true
			}),
		function(req, res) {
			//console.log('----');
			//console.log(req.user);
			res.setHeader("pf_auth_oauth ", req.user.oauth);
			console.log('successfully logged.redirecting to: '+req.session.redirect_to);
			res.redirect(req.session.redirect_to? req.session.redirect_to: '/');
		}
	);
  // app.route('/login').get(auth.login);
  // app.route('/api/auth/signout').post(auth.loginCallback);
};
