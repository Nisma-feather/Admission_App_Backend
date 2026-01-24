const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer");
const { storeMediaCollege, getMediaofCollege } = require('../controllers/mediaController');

router.post("/:collegeId",upload.array("media",4),storeMediaCollege);
router.get("/:collegeId",getMediaofCollege)

module.exports = router