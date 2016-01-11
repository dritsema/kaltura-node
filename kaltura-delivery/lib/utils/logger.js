var winston = require('winston'),
    moment = require('moment');
    winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp:function() {
                        return moment().format('MMMM Do YYYY, h:mm:ss a'); },
            colorize:true,
            level: 'debug',
            handleExceptions: true,

        })
    ],
    exitOnError: false
});
module.exports = logger;
