'use strict';

/**
 * Module dependencies.
 */
var chalk = require('chalk'),
	properties = require('../config/properties.loader'),
	passport = require('passport');


exports.login = function (req, res, next) {
	console.log('error');
  passport.authenticate(properties.passport.strategy,
		{
			successRedirect : "/",
			failureRedirect : "/login",
		})
};

exports.loginCallback = function (req, res, next) {
	console.log('callback');
	passport.authenticate(config.passport.strategy,
		{
			failureRedirect: '/error',
			failureFlash: true
		},
		function(req, res) {
			console.log('successfully logged.redirecting to: '+req.session.redirect_to);
			res.redirect(req.session.redirect_to? req.session.redirect_to: '/');
		}
	);
};
