const express = require("express");
const router = express.Router();
const {createCollege, changeVerificationStatus, getColleges, getCollegeById,updateCollegeWithImages,updateCollegeData} = require("../controllers/collegeController");

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
router.get("/getById/:userId", getCollegeById);
router.put("/details/:collegeId", updateCollegeData);


module.exports=router;