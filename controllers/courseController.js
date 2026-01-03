const mongoose = require("mongoose");
const Course = require("../models/Courses");
const College = require("../models/College");


const addCourse = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const isCollegeExists = await College.findById(collegeId);
    if (!isCollegeExists) {
      return res.status(404).json({ message: "College not found" });
    }

    const newCourse = await Course.create({
      ...req.body,
      college: collegeId,
    });

    return res.status(201).json({
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Unable to add the course",
    });
  }
};


const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

   
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });

    return res.status(200).json({
      message: "Updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Course update failed",
    });
  }
};


const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Unable to delete the course",
    });
  }
};

const getCourse = async (req, res) => {
  try {
    const { name = "", loc, feeMin, feeMax } = req.query;

    console.log("query params", req.query);

    // Convert filters safely to arrays
    const level =
      typeof req.query.level === "string" && req.query.level.trim()
        ? req.query.level.split(",").map((v) => v.trim())
        : [];

    const category =
      typeof req.query.category === "string" && req.query.category.trim()
        ? req.query.category.split(",").map((v) => v.trim())
        : [];

    const duration =
      typeof req.query.duration === "string" && req.query.duration.trim()
        ? req.query.duration
            .split(",")
            .map((n) => Number(n))
            .filter((n) => !isNaN(n))
        : [];

    // Base match stage
    const matchStage = {
      isActive: true,

      // Name / specialization search
      ...(name && {
        $or: [
          { name: { $regex: name, $options: "i" } },
          { specialization: { $regex: name, $options: "i" } },
        ],
      }),

      // Location
      ...(loc && {
        "college.location.city": {
          $regex: loc.split(",")[0].trim(),
          $options: "i",
        },
      }),

      // Filters
      ...(level.length > 0 && { level: { $in: level } }),
      ...(category.length > 0 && { category: { $in: category } }),
      ...(duration.length > 0 && { duration: { $in: duration } }),
    };

    // ✅ FEES RANGE OVERLAP LOGIC
    if (feeMin !== undefined && feeMax !== undefined) {
      matchStage.$and = [
        ...(matchStage.$and || []),
        {
          "fees.max": { $gte: Number(feeMin) },
          "fees.min": { $lte: Number(feeMax) },
        },
      ];
    }

    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "colleges",
          localField: "college",
          foreignField: "_id",
          as: "college",
        },
      },
      { $unwind: "$college" },
      { $match: matchStage },
      {
        $project: {
          
          name: 1,
          specialization: 1,
          level: 1,
          category: 1,
          duration: 1,
          fees: 1,
          "college.name": 1,
          "college.location": 1,
        },
      },
    ]);

    return res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Unable to fetch courses",
    });
  }
};

const getCourseById=async(req,res)=>{
  try{
  const {courseId} = req.params;
  const course = await Course.findById(courseId)
    .populate("college", "name location");
  if (!course) {
    return res.status(404).json({message:"course not found"})
  }
  return res.status(200).json({course})
  
    
  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"Can't able to get the course by its Id"})
    
  }
}




module.exports = {
  addCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getCourseById

};
