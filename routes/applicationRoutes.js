const express = require('express');
const {getApplicationsByCourse,createAdmissionApplication, updateApplicationStatus, applicationByUser, getApplicationById, getApplicationDetails} = require("../controllers/AdmissionApplicationController")
const upload = require("../middlewares/multer")
const router = express.Router();

router.post("/", upload.array("files"),createAdmissionApplication);
router.get("/by-course/:courseAdmissionId",getApplicationsByCourse)
router.post("/update-status/:applicationId",updateApplicationStatus);
router.get("/getById/:applicationId",getApplicationById);
router.put("/update-status/:applicationId",updateApplicationStatus);
router.get("/details/:applicationId",getApplicationDetails)
router.get("/:userId", applicationByUser);




module.exports = router