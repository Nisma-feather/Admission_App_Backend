const express = require("express");
const router = express.Router();
const {createCollege, changeVerificationStatus, getColleges, getCollegeByUserId,updateCollegeWithImages,updateCollegeData, getCollegeByCollegeId} = require("../controllers/collegeController");

const upload = require("../middlewares/multer");

router.post("/create",createCollege);
router.get("/",getColleges);


router.post(
  "/update/:collegeId",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  updateCollegeWithImages
);
router.patch("/verification-status/:collegeId", changeVerificationStatus);
router.get("/getById/:userId", getCollegeByUserId);
router.get("/getByCollegeId/:collegeId", getCollegeByCollegeId )
router.put("/details/:collegeId", updateCollegeData);


module.exports=router;