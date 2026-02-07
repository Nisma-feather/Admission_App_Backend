const express = require("express");
const router = express.Router();
const {changeCollegeStatus, getAdminDashboardOverview} = require("../controllers/adminController");


router.patch("/verification-status/:collegeId",changeCollegeStatus)
router.get("/overview",getAdminDashboardOverview);

module.exports = router