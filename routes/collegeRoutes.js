const express = require("express");
const router = express.Router();
const {createCollege, changeVerificationStatus, getColleges, getCollegeById} = require("../controllers/collegeController")

router.post("/create",createCollege);
router.get("/",getColleges);

router.patch("/verification-status/:collegeId",changeVerificationStatus);
router.get("/getById/:collegeId",getCollegeById)


module.exports=router;