const jwt = require("jsonwebtoken");
const users = require("../models/users");
const bcrypt = require('bcrypt');
const config = require("../config/config");

const generateToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    })
}

const signupController =  async (request,response) => {
    try {
        const {username, email, password} = request.body;
        if(password?.length < 7){
            return response.status(400).json({message: "Password can't be less than 7 charecters"});
        }

        const emailExists = await users.findOne({email});
        if(emailExists){
            return response.status(400).json({message: "Email is already associated with a different account"});
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await users.create({
            username, password: hashedPassword, email
        })

        const result = newUser.toJSON();
        delete result.password;
        delete result.deletedAt;

        result.token = generateToken({
            id: result.id
        })
        if(!result){
            return response.status(400).json({message: "Invalid credentials, Failed to create user"});
        }
        
        return response.status(201).json({status: "success", data: result});
    } catch (error) {
        return response.status(500).json({error: 'Internal server erorr, look at authController', error});
    }
}


const loginController =  async (request,response) => {
    try {
        const {email, password} = request.body;

        if(!email || !password){
            return response.status(400).json({message: "Kindly provide email and password"});
        }

        if(password?.length < 7){
            return response.status(400).json({message: "Password can't be less than 7 charecters"});
        }

        const userExists = await users.findOne({where: {email}});
     
        const isPasswordVerified = await bcrypt.compare(password, userExists.password);

        if(!isPasswordVerified || !userExists){
            return response.status(401).json({message: "Invalid email and password"});
        }

        const token = generateToken({
            id: userExists.id
        })

        return response.status(201).json({status: "Logged in", token});
    } catch (error) {
        return response.status(500).json({error: 'Internal server erorr, look at authController', error});
    }
}

module.exports = {signupController, loginController};