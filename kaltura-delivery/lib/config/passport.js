var SamlStrategy = require('passport-saml').Strategy

module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	passport.use(new SamlStrategy(
	  {
	    path: config.passport.saml.path,
	    entryPoint: config.passport.saml.entryPoint,
	    issuer: config.passport.saml.issuer
	  },
	  function(profile, done) {
	  	//console.log('profile');
	  	console.log(profile);
		return done(null,
			{
				//id : profile.uid,
				email : profile.email,
				firstName : profile.gn,
  				lastName : profile.sn,
  				oauth : profile.oauth,
  				guid : profile.serialNumber
			});
	  })
	);

}
