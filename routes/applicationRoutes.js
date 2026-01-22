const express = require('express');
const {createAdmissionApplication} = require("../controllers/AdmissionApplicationController")
const upload = require("../middlewares/multer")
const router = express.Router();

router.post("/", upload.array("files"),createAdmissionApplication)


module.exports = router