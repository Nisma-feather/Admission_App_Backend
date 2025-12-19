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

module.exports = {
  addCourse,
  updateCourse,
  deleteCourse,
};
