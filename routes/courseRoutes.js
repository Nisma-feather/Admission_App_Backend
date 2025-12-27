const express = require("express");
const router = express.Router();
const {
  addCourse,
  updateCourse,
  deleteCourse,
  getCourse,
} = require("../controllers/courseController");


router.get("/",getCourse)
router.post("/:collegeId", addCourse);
router.put("/:courseId",updateCourse);
router.delete("/:courseId",deleteCourse);

module.exports = router;






