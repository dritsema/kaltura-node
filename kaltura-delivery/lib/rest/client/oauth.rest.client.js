//'use strict';
var rest = require('restler'),
	chalk = require('chalk'),
	properties= require('../../config/properties.loader');

var OAuthRestClient = function() {
  	this.oauthServiceBaseUrl = properties.OAUTH_SERVICE_BASE_URL;
   	this.oauthAuthenticateRestEndPoint = properties.OAUTH_SERVICE_AUTHENTICATE_END_POINT;
	this.oauthTokenValidateRestEndPoint = properties.OAUTH_SERVICE_VALIDATE_END_POINT;
  	this.appId = properties.APP_ID;
  	this.appKey = properties.APP_KEY;
};
OAuthRestClient.prototype.validateToken = function (appToken, userToken ) {
	var userValidateUrl =this.oauthServiceBaseUrl + this.oauthTokenValidateRestEndPoint + userToken;
	console.log(userValidateUrl);
	return rest.get(userValidateUrl, { headers : { Authorization : appToken } } );
};

OAuthRestClient.prototype.authenticate = function(){
	 var appAuthUrl = this.oauthServiceBaseUrl + this.oauthAuthenticateRestEndPoint +
	 					'/' + this.appId + '/' + this.appKey;
	console.log(this.oauthServiceBaseUrl);
    return rest.get(appAuthUrl);
};
module.exports = new  OAuthRestClient();
