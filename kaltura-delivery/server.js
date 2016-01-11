'use strict'

var chalk = require('chalk'),
  properties = require('./lib/config/properties.loader');

var app = require('./lib/config/express')();

app.listen(3000);
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
exports = module.exports = app;

console.error(chalk.black.bgWhite('Application started on port ' + 3000));
