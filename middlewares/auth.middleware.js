const catchAsyncError = (fn) => {
    const errorHandler = (request, response, next) => {
        fn(request, response, next).catch(next)
    }

    return errorHandler;
}

class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'failed' : 'error';
        this.isOperational = true;


        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {catchAsyncError, AppError};