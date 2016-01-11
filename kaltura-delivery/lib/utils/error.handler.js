module.exports = function() {
    var service = {
        init: init,
        logErrors: logErrors
    };
    return service;

    function init(err, req, res, next) {
        var status = err.statusCode || 500;
        console.log('Error status :' + status);
        if (err.message) {
            res.status(status).send(err.message);
        } else {
            res.status(status).send(err);
        }
    }

    /* Our fall through error logger and errorHandler  */
    function logErrors(err, req, res, next) {
        var status = err.statusCode || 500;
        console.error(status + ' ' + (err.message ? err.message : err));
        if (err.stack) {
            console.error(err.stack);
        }
        next(err);
    }
};
