const express = require('express');
const router = express.Router();
const {getUnassignedCourses, createCourseAdmission, getCourseAdmissionStatus, getAcademicAdmissionDetails, getCoursesByAcademyYear, getCourseAdmissionsAgg} = require("../controllers/courseAdmissionController.js")

router.get("/isOpen/:courseId",getCourseAdmissionStatus)
router.post("/:collegeId/:courseId",createCourseAdmission)
router.get("/not-assigned/:collegeId",getUnassignedCourses);
router.get("/get-academic-courses",getCoursesByAcademyYear);
router.get("/open-admission-courses",getCourseAdmissionsAgg);
router.get("/:courseAdmissionId",getAcademicAdmissionDetails);


module.exports=router