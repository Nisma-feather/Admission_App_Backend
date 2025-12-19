const express = require("express");
const router = express.Router();
const {createCollege, changeVerificationStatus} = require("../controllers/collegeController")

router.post("/create",createCollege);
router.patch("/verification-status/:collegeId",changeVerificationStatus)


module.exports=router;