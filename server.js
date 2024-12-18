const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const authRouter = require('./routes/auth.routes');
const { catchAsyncError, AppError } = require('./middlewares/auth.middleware');
const globalErrorHandler = require('./controllers/error.controller');

const PORT = process.env.APP_PORT;
const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("*", catchAsyncError(async(request, response, next) => {
    throw new AppError(`Can't find ${request.originalUrl} on this server`, 404);
}))

app.use(globalErrorHandler);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

