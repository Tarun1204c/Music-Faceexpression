const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        reuired: [true, "token is required for blacklisting."],
    }
}, {
    timestamps: true
})


const blacklistModel = mongoose.model("blacklist", blacklistSchema)

module.exports = blacklistModel