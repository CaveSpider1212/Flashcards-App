const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode !== 200 ? err.statusCode : 500;

    switch (statusCode) {
        case 400:
            res.status(statusCode).json({
                title: "Bad request",
                message: err.message,
                stack: err.stack
            })

            break;
        case 401:
            res.status(statusCode).json({
                title: "Unauthorized",
                message: err.message,
                stack: err.stack
            })

            break;
        case 403:
            res.status(statusCode).json({
                title: "Forbidden",
                message: err.message,
                stack: err.stack
            })

            break;
        case 404:
            res.status(statusCode).json({
                title: "Not found",
                message: err.message,
                stack: err.stack
            })

            break;
        case 500:
            res.status(statusCode).json({
                title: "Internal server error",
                message: err.message,
                stack: err.stack
            })

            break;
        default:
            console.log(err);

            break;
    }
}

module.exports = errorHandler;