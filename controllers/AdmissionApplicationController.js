const AdmissionApplication = require("../models/AdmissionApplication");
const Courses = require("../models/Courses");

const createAdmissionApplication=async(req,res)=>{
    try{
    
        const newApplication= await AdmissionApplication.create(req.body)
        return res.status(200).json({newApplication})
    }
    catch(e){
        console.log(e);
        return res.status("Can't able to place the application forn")
        
    }

}

const getApplicationsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(403).json({ message: "required field is missing" });
    }

    const isCourseExisting = await Courses.findById(courseId);
    if (!isCourseExisting) {
      return res.status(404).json({ message: "" });
    }
    const applications = await AdmissionApplication.find({ course: courseId });
    return res.status(200).json({ applications });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "Can't able to get the application for the courses",
    });
  }
};

module.exports ={createAdmissionApplication}