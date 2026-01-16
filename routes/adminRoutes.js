const express = require("express");
const router = express.Router();
const {changeCollegeStatus} = require("../controllers/adminController");


router.patch("/verification-status/:collegeId",changeCollegeStatus)

module.exports = router