const express = require("express");
const router = express.Router();
const {addAcademicYear,updateAcademicYear, getAllAcademicYears} = require("../controllers/academicYearController")


router.get("/",getAllAcademicYears);
router.post("/",addAcademicYear);
router.put("/:academicYearId",updateAcademicYear);

module.exports = router