const ErrorHandler = (err, res, next) => {

    if (err.name === 'CustomError') {
        res.status(err.statusCode);
        delete err.statusCode;
        delete err.name;
        res.json(err);
    } else {

        next(err);
    }

}

export default ErrorHandler
