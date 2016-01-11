exports.getUserOAuthToken = function(request){
	//var userOAuthToken = request.headers.pf_auth_oauth;
	var userOAuthToken = request.user.oauth;
	return userOAuthToken;
};
