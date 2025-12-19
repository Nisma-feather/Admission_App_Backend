const College = require("../models/College");

const createCollege = async(req,res)=>{
    try{
      
      const newCollege = College.create(req.body);
      return res.status(200).json({message:"College created successfully"})
  
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"failed to create the college cccount"})
    }
}

const changeVerificationStatus=async(req,res)=>{
    try{
        const {collegeId} = req.params;
        const {verificationStatus} = req.body;
        const statusArray = ["Pending", "Approved", "Rejected"];
        
        const collegeExists = await College.findById(collegeId);
        if(!collegeExists){
            return res.status(404).json({message:"College not found"})
        }
        if(!statusArray.includes(verificationStatus)){
            return res.status(404).json({message:"Not a valid verification status"})
        }
        const updatedCollege = await College.findByIdAndUpdate(collegeId, {
           verificationStatus
        },{
            new:true
        })
       return res.status(200).json({message:"Verification status updated successfully",updatedCollege})
    }
    catch(e){
        console.log(e);
        return res.status(200).json({message:"Can't able to change the cerification Status"})
    }
}


module.exports = {createCollege,changeVerificationStatus}