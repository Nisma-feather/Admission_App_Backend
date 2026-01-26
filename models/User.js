const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,

    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","college","user"],
        default:"user"
    },

},{timestamps:true});

module.exports = mongoose.model("User",userSchema)