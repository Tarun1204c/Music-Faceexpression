const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    email:{
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    password:{
        type: String,
        required: [true, "Password must be required"]
        
    }
})


const userModel = mongoose.model("users", userSchema);

module.exports = userModel;