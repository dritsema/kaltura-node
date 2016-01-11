'use strict'

var chalk = require('chalk'),
  properties = require('./app/config/properties.loader');

var app = require('./app/config/express')();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
exports = module.exports = app;
