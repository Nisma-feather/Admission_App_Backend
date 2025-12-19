const User = require("../models/User");
const bcrypt = require("bcrypt")

const createUser=async(req,res)=>{
    try{
      const {email,password,role} = req.body;
      if(!email || !password){
           return res.status(400).json({message:"Required fields is missing "})
      }

      const existing = await User.findOne({email});

      if(existing){
        return res.status(404).json({message:"Account already exists"})
      }

      const hashPassword = await bcrypt.hash(password,10);

      const user = await User.create({email,password:hashPassword})
      return res.status(200).json({message:"User created successfully"})

    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"Can't able to create the user"})
    }
}

module.exports = {createUser}