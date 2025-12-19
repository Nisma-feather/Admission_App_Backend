const express = require("express");
const router = express.Router();
const {
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.post("/:collegeId", addCourse);
router.put("/:courseId",updateCourse);
router.delete("/:courseId",deleteCourse);

module.exports = router;






