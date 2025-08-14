/**
 * DESCRIPTION: Displays various different JSON messages depending on the error status code passed into the function
 * 
 * STATUS CODES:
 * 400 - Bad request
 * 401 - Unauthorized
 * 403 - Forbidden
 * 404 - Not found
 * 500 - Internal server error
 */
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