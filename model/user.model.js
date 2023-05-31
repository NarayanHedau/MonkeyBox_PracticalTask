const mongoose = require("mongoose")

const User = new mongoose.Schema({
    accessToken: {type: String},
    refreshToken: {type: String},
}, 
{timestamps:true}
)
module.exports= mongoose.model("UserSchema", User)