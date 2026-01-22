const express = require("express");
const router = express.Router();
const {createCollege, changeVerificationStatus, getColleges, getCollegeById,updateCollegeWithImages} = require("../controllers/collegeController");

const upload = require("../middlewares/multer");

router.post("/create",createCollege);
router.get("/",getColleges);

router.patch("/verification-status/:collegeId",changeVerificationStatus);
router.get("/getById/:collegeId",getCollegeById);
router.put(
  "/update-with-images/:collegeId",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  updateCollegeWithImages
);


module.exports=router;