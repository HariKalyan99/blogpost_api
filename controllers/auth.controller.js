const jwt = require("jsonwebtoken");
const users = require("../models/users");
const bcrypt = require('bcrypt');
const config = require("../config/config");
const { catchAsyncError, AppError } = require('../middlewares/auth.middleware')

const generateToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    })
}

const signupController = catchAsyncError(async (request,response, next) => {
    try {
        const {username, email, password} = request.body;
        if(password?.length < 7){
            return next(new AppError("Password can't be less than 7 charecters", 400));
        }

        const emailExists = await users.findOne({where: {email}});
        if(emailExists){
            return next(new AppError("Email is already associated with a different account", 400));
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await users.create({
            username, password: hashedPassword, email
        })

        if(!newUser){
            return next(new AppError("Invalid credentials, Failed to create user", 400));
        }

        const result = newUser.toJSON();
        delete result.password;
        delete result.deletedAt;

        result.token = generateToken({
            id: result.id
        })
        
        
        return response.status(201).json({status: "success", data: result});
    } catch (error) {
        return next(new AppError("Internal server erorr, look at authController", 500))
    }
})


const loginController =  async (request,response, next) => {
    try {
        const {email, password} = request.body;

        if(!email || !password){
            return next(new AppError("Kindly provide email and password", 400))
        }

        if(password?.length < 7){
            return next(new AppError("Password can't be less than 7 charecters", 400));
        }

        const userExists = await users.findOne({where: {email}});
     
        const isPasswordVerified = await bcrypt.compare(password, userExists.password);

        if(!isPasswordVerified || !userExists){
            return next(new AppError("Invalid email and password", 401))
        }

        const token = generateToken({
            id: userExists.id
        })

        return response.status(201).json({status: "Logged in", token});
    } catch (error) {
        return next(new AppError("Internal server erorr, look at authController", 500));
    }
}

module.exports = {signupController, loginController};