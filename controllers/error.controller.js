const config = require("../config/config");
const { AppError } = require("../middlewares/auth.middleware");


const sendErrorDev = (error, response) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;


    return response.status(statusCode).json({
        status, message, stack
    })
} 


const sendErrorProd = (error, response) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;


    if(error.isOperational){
        return response.status(statusCode).json({
            status, message
        })
    }
    console.log(error.name, error.message, error.stack)
    return response.status(500).json({
        status: 'error', message: "Something went wrong"
    })
} 

const globalErrorHandler = (error, request, response, next) => {
    if(error.name === 'SequelizeValidationError'){
        error = next(new AppError(error.errors[0].message, 400));
    }
    if(error.name === 'SequelizeUniqueConstraintError'){
        error = next(new AppError(error.errors[0].message, 400));
    }
    // these errors above are meant for the validation and constrains in the sql level
    if(config.NODE_ENV === "development"){
        return sendErrorDev(error, response)
    }

    return sendErrorProd(error, response)
}

module.exports = globalErrorHandler;