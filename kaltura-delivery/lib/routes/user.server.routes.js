'use strict';

/**
 * Module dependencies.
 */
var users = require('../controllers/users.controller');

module.exports = function(app) {
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated())
	    return next();
	  else{
	  		console.log('after authentication redirect to'+ req.path);
	  		req.session.redirect_to = req.path;
	    	return res.redirect('/login');
		}
	}

	app.route('/userinfo').get(ensureAuthenticated,users.info);
	app.route('/ping').get(ensureAuthenticated,users.ping);
};
