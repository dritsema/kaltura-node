/**
 * Require login routing middleware
 */
var chalk = require('chalk'),
	properties = require('../config/properties.loader'),
	oauthRestClient = require('../rest/client/oauth.rest.client'),
	_ = require('lodash'),
	securePaths = ['/userinfo','/ping'];
var tokenextractor = require('../utils/user.oauth.extractor.js');
var error = chalk.bold.red,
	debug = chalk.italic.yellow;

module.exports = function(){
	return function(req, res, next) {
		if ( ! _.contains(securePaths, req.path) ) return next();
		var userOAuthToken = tokenextractor.getUserOAuthToken(req);
		if (!userOAuthToken || userOAuthToken.length ===0) {
			return handleError(properties.errors.missingUserOauthToken);
		}
		var appOAuthToken= req.app.get( properties.APP_OAUTH_TOKEN );
		oauthRestClient.validateToken(appOAuthToken, userOAuthToken).on('complete', function(result) {
			/*jshint camelcase: false */
		  	if (result instanceof Error  || !result.token_valid ) {
			    return handleServerError( properties.errors.oAuthServerCallError, result.message );
			  }else {
			    //console.log('data from oauth server '+JSON.stringify(result));
			    if(result.token_valid ==='true'){
			    	//check if user has roles
			    	if(result.access_token && result.access_token.role && result.access_token.role.length>0){
				    	//pushing the user info in request
				    	req.user= result.access_token;
				    	next();
			    	}else{
			    		console.log(debug('response received from oauth server for unauthorized user :'+ JSON.stringify(result)));
			    		return handleError(properties.errors.unauthorizedUser);
			    	}
			    }else if(result.token_valid ==='false'){
			    	return handleError(properties.errors.sessionExpired);
			    }
			  }
		  });

		function handleError(errorInfo){
			var err = new Error(errorInfo.errorMessage);
			err.statusCode = errorInfo.statusCode;
			return next(err);
		}

		function handleServerError(errorInfo, errorMessage){
			errorMessage = errorMessage ||'';
			errorMessage = errorInfo.errorMessage+': ' + JSON.stringify(errorMessage);
			console.log(error(errorMessage));
			var err = new Error(errorMessage);
			err.statusCode = errorInfo.statusCode;
			return next(err);
		}
	};
};
