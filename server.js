const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const authRouter = require('./routes/auth.routes');

const PORT = process.env.APP_PORT;
const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

