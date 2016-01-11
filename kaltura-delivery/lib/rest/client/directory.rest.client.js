//'use strict';
var rest = require('restler'),
	chalk = require('chalk'),
	properties= require('../../config/properties.loader');

var DirectoryServiceRestClient = function() {
  	this.directoryRestServiceBaseUrl = properties.DIRECTORY_REST_SERVICE_BASE_URL;
   	this.directoryServicePersonLightEndPoint = properties.DIRECTORY_PERSON_LIGHT_END_POINT;
};
DirectoryServiceRestClient.prototype.getPerson = function (appToken, personGuid ) {
	var peronsLightUrl =this.directoryRestServiceBaseUrl + this.directoryServicePersonLightEndPoint + '/' + personGuid;
	return rest.get(peronsLightUrl, { headers : { Authorization : appToken } } );
};

module.exports = new  DirectoryServiceRestClient();
