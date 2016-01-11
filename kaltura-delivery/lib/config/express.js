'use strict';

/**
 * Module dependencies.
 */
	var http = require('http'),
		express = require('express'),
		passport = require("passport"),
		methodOverride = require('method-override'),
		morgan = require('morgan'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		flash = require('connect-flash'),
		path = require('path'),
		cors = require('cors'),
		chalk = require('chalk'),
		expressValidator = require('express-validator'),
		properties = require('./properties.loader'),
		authenticateUser = require('../middleware/authenticate.user') ,
		errorHandler = require('../utils/error.handler')(),
		appOAuthTokenService = require('../middleware/app.oauthtoken'),
		session = require('express-session'),
		sessionStore = new session.MemoryStore();

		//configure session attributes (e.g. life of your session) via express
	var sessionOpts =     {
		store: sessionStore,
		secret: 'this works',
		resave: false,
		saveUninitialized: true,
		cookie : { httpOnly: true, maxAge: 3600000 }
		};
		/* Commenting Out Homefield */
		// require('./passport')(passport, properties);
	var error = chalk.red;

module.exports = function() {
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()){
			sessionStore.length(function(err,len){
				console.log('total sessions:'+ len);
			});
			return next();
		}else{
			console.log('after authentication redirect to'+ req.path);
			req.session.redirect_to = req.path;
		return res.redirect('/login');
		}
	}
	
	var app = express();
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

		// Showing stack errors
		app.set('showStackError', true);
		app.engine('.html', require('ejs').renderFile);
		app.set('view engine', 'html');
		app.set('view options', {
		layout: false
	});
	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(expressValidator());
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(morgan('combined'));
	// connect flash for flash messages
	app.use(flash());
	app.use(cors());
	app.use(session(sessionOpts));
		/* Commenting Out Homefield */
		//app.use(passport.initialize());
		//app.use(passport.session());
	app.use(methodOverride());
	/* Commenting Out Homefield */
	//require('../routes/authenticate.routes')(app);
	//app.use(ensureAuthenticated);
	
	app.use(express.static(__dirname + '/../../app/views'));
	app.use(express.static(__dirname + '/../../app'));
	app.use(express.static(__dirname + '/../../app/bower_components'));

		/* Commenting Out Homefield */
		//var tokenService = appOAuthTokenService(app);
		//tokenService.getOAuthToken();
		//tokenService.scheduleTokenRefresh();
	
	/* Commenting Out Homefield */
	// require('../routes/user.server.routes')(app);

	app.get('*', function(req, res) {
		res.sendfile('../../app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	app.use(errorHandler.init);

	return app;
};
