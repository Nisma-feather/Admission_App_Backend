const express = require('express');
const router = express.Router();
const {getUnassignedCourses, createCourseAdmission, getCourseAdmissionStatus, getAcademicAdmissionDetails} = require("../controllers/courseAdmissionController.js")

router.get("/isOpen/:courseId",getCourseAdmissionStatus)
router.post("/:collegeId/:courseId",createCourseAdmission)
router.get("/not-assigned/:collegeId",getUnassignedCourses);
router.get("/:courseAdmissionId",getAcademicAdmissionDetails);


module.exports=router