'use strict';

/**
 * Module dependencies.
 */
var chalk = require('chalk'),
	moment = require('moment'),
	properties = require('../config/properties.loader'),
	oauthRestClient = require('../rest/client/oauth.rest.client');

//defining error style
var error = chalk.red,
	info = chalk.white;

module.exports  = function(app) {
	var service ={};
	service= {
		refreshOAuthTokenOn : new Date(),
		getOAuthToken : getOAuthToken,
		scheduleTokenRefresh : scheduleTokenRefresh
	};
	return service;

  	function getOAuthToken () {
		oauthRestClient.authenticate().on('complete', function(response){
	        processOAuthResponse(response);
	    });
	}

 	function processOAuthResponse(data) {
	    dataHandling(data);
	    var str = data.toString();
	}

	function dataHandling(data) {
		var dataObj =null;
		try {
		   dataObj = JSON.parse(JSON.stringify(data));
		}
		catch (e) {
			console.log('error');
		}
		/*jshint camelcase: false */
		var tokenString = (data.token_type ||dataObj.token_type)+ ' ' + (data.access_token|| dataObj.access_token);
	    app.set(properties.APP_OAUTH_TOKEN , tokenString);
	    console.log(info('Application Oauth token refreshed :'+ tokenString) );
	    var refreshAfter=dataObj.expires_in - properties.REFRESH_THRESHOLD;
	    service.refreshOAuthTokenOn= moment(service.refreshOAuthTokenOn).add(refreshAfter, properties.SECONDS_STR);
	    console.log('Token will be renewed at ', service.refreshOAuthTokenOn.format());
	}

	//call every 5 min and make request for new auth token if its time for getting new token
	function scheduleTokenRefresh(){
		setInterval( function() {
	 	   //check if its time to request for new token
		    if(service.refreshOAuthTokenOn.diff(moment())<=properties.FIVE_MIN_MS){
		    	//if token is valid for less than five minutes refresh to avoid slips
		        console.log('fetching new oauth token. older token', app.get(properties.APP_OAUTH_TOKEN));
		        service.getOAuthToken();
		    }
		}, properties.FIVE_MIN_MS);
	}
};
