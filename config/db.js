const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async()=>{
    try{
        const res = await mongoose.connect(process.env.MONGODB_URI)
        console.log("DATABASE CONNECTED SUCCESSFULLY")
    }
    catch(e){
        console.log(e)
    }
}

module.exports = connectDB