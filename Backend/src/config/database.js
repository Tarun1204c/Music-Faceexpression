
const mongoose = require("mongoose");

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(err => {
        console.log(" Error Connecting to DB", err)
    })
}

module.exports = connectToDB

