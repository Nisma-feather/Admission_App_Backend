const express = require("express");
const router = express.Router();
const {
  addCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getCourseById,
} = require("../controllers/courseController");

// 69560fcf53a3c0af54f4d9ff


router.get("/",getCourse)
router.post("/:collegeId", addCourse);
router.put("/:courseId",updateCourse);
router.delete("/:courseId",deleteCourse);
router.get("/:courseId",getCourseById);

module.exports = router;






