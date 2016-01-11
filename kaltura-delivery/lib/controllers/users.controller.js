'use strict';

/**
 * Module dependencies.
 */
var chalk = require('chalk'),
	_ = require('lodash'),
	properties = require('../config/properties.loader'),
	directoryServiceRestClient = require('../rest/client/directory.rest.client');
var error = chalk.bold.red;


/**
 * User middleware
 */
exports.info = function(req, res) {
	var user = JSON.parse(JSON.stringify(req.user));
	console.log(user);
	directoryServiceRestClient.getPerson( user['oauth'] , user['guid'])
									.on('complete', processResponse);
	function processResponse(result, response ){
	  	if (result instanceof Error || response.statusCode != properties.HTTP_SUCCESS_CODE ) {
		    return processError(result);
		}else {
			return res.status(properties.HTTP_SUCCESS_CODE).send(processData(result));
	 	}
  	}
  	function processData(person){
		if (!person) {
			return {};
		}
		return {
		   	formattedName: person.formattedName,
            email:person.primaryEmail,
            title:person.position? person.position.positionName:'',
            departmentName: person.department? person.department.departmentName:'',
			guid : person.guid,
			oauth : user.oauth ||[]
		};
	}
  	function processError(err) {
	      console.log(error('An error occurred while fetching/processing person info:' + JSON.stringify(err)));
	      var msg= err.message ||'';
	      return res.status(500).send({ message:  msg });
	}
};

exports.ping = function(req, res) {
	return res.status(200).send({result: 'ok' });
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status (403).send({ message: "User is not authorized" });
			}
		});
	};
};
