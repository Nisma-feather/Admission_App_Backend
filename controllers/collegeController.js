const College = require("../models/College");

const createCollege = async(req,res)=>{
    try{
      const {user}=req.body

      const isUserExists = await College.findOne({user});
      if(isUserExists){
        return res.status(404).json({message:"Collge already Exists"})
      }
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

const getColleges = async (req, res) => {
  try {
    console.log("queries received", req.query)
    let { name, loc,  nba,verificationStatus="" } = req.query;
   

    const collegeType = req.query?.collegeType
      ? req.query.collegeType.split(",")
      : [];

    const facilities = req.query?.facilities
      ? req.query.facilities.split(",")
      : [];
    console.log("facilities",facilities)
     
    const accreditation = req.query?.accreditation
        ? req.query.accreditation.split(",")
        : [];


    let query = {};

    // Name
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Location
    if (loc) {
      const city = loc.split(",")[0].trim();
      query["location.city"] = { $regex: city, $options: "i" };
    }

    // College Type
    if (collegeType.length > 0) {
      query.type = { $in: collegeType };
    }

    // Facilities
    if (facilities.length > 0) {
      facilities.forEach((f) => {
        query[`facilities.${f}`] = true;
      });
    }

    // NAAC
    if (accreditation.length > 0) {
      query["accreditation.naac"] = { $in: accreditation };
    }

    // NBA
    if (nba && nba === true) {
      query["accreditation.nba"] = nba 
    }
    if (verificationStatus && verificationStatus.trim() !== ""){
      query.verificationStatus = verificationStatus;
    }
      console.log("FINAL QUERY:", query);

    const colleges = await College.find(query).select(
      "name location establishedYear type facilities accreditation placement admission verificationStatus"
    );

    return res.status(200).json({ collegCount:colleges.length, colleges });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Can't able to get the colleges",
    });
  }
};

//get college details based on ID

const getCollegeById=async(req,res)=>{
  try{
    const {collegeId} = req.params;
   const college = await College.findById(collegeId);
   return res.status(200).json({ college });
  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"Can't able to get the college details"})
    
  }
}


module.exports = {createCollege,changeVerificationStatus,getColleges,getCollegeById}