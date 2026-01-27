const express = require('express');
const {createAdmissionApplication, updateApplicationStatus, applicationByUser, getApplicationById} = require("../controllers/AdmissionApplicationController")
const upload = require("../middlewares/multer")
const router = express.Router();

router.post("/", upload.array("files"),createAdmissionApplication);

router.post("/update-status/:applicationId",updateApplicationStatus);
router.get("/getById/:applicationId",getApplicationById)
router.get("/:userId", applicationByUser);



module.exports = router