const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model")

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            { email },
            { username }
        ]

    })

    if(isAlreadyRegistered){
        return res.status(400).json({
            message: "Us with the username is already exists" 
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username

    }, process.env.JWT_SECRET, 
       {

           expiresIn: "3d"
           
        }
    )


    res.cookie("token", token)

    return res.status(201).json({
        message: "User registered sucessfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email

        }
    })

    
}

async function loginUser(req, res){
    const { email , password, username } = req.body;


    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("+password")
    if(!user){
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }


    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        }
    )

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in sucessfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}
async function getMe(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User fetched suceesfully",
        user
    })
}

async function logoutUser(req,res){

    const token = res.cookies.token

    res.clearCookie("token")

    await blacklistModel.create({
        token
    })

    res.status(201).json({
        message: "Logout sucessfully"
    })

}

module.exports = {registerUser, loginUser, getMe, logoutUser}