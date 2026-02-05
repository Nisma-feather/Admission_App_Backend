const AcademicYear = require("../models/AcademicYear");

const addAcademicYear = async (req, res) => {
  try {
    const { label, isActive } = req.body;

    if (!label) {
      return res.status(400).json({
        message: "Academic year label is required",
      });
    }

    // Prevent duplicate academic year
    const existingYear = await AcademicYear.findOne({ label });
    if (existingYear) {
      return res.status(409).json({
        message: "Academic year already exists",
      });
    }

    // If new year is active → deactivate all others FIRST
    if (isActive) {
      await AcademicYear.updateMany(
        { isActive: true },
        { $set: { isActive: false } },
      );
    }

    const newAcademicYear = await AcademicYear.create({
      label,
      isActive: !!isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Academic year added successfully",
      data: newAcademicYear,
    });
  } catch (error) {
    console.error("Add academic year error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add academic year",
    });
  }
};

const updateAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;
    const { active } = req.body;

    // If this academic year is being set to active,
    // deactivate all other academic years
    if (active === true) {
      await AcademicYear.updateMany(
        { _id: { $ne: academicYearId } },
        { $set: { active: false } },
      );
    }

    // Update the selected academic year
    const updatedYear = await AcademicYear.findByIdAndUpdate(
      academicYearId,
      { $set: { active } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Academic year updated successfully",
      data: updatedYear,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAllAcademicYears = async(req,res)=>{
    try{
        const years = await AcademicYear.find();
        const activeYear = await AcademicYear.findOne({active:true});
        return res.status(200).json({years,activeYear})

    }
    catch(e){
        console.log(e)
    }
}

module.exports = {addAcademicYear,updateAcademicYear,getAllAcademicYears}
