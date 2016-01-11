var properties = require('../config/properties.loader.js');
/*util function for processing the restler callbacks and returns the response with no additional processing*/
exports.processResponse = function(res,result, response){
  	if (result instanceof Error || !response||  response.statusCode != properties.HTTP_SUCCESS_CODE) {
	    return res.status(response ? response.statusCode : properties.HTTP_INTERNAL_SERVER_ERROR_CODE)
	    		  .send( { message : result || JSON.stringify(result) });
	}else {
		return res.status(properties.HTTP_SUCCESS_CODE).send(result);
 	}
};
