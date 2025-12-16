const express = require("express");
const { getSearchLocation } = require("../controllers/locationController");
const router = express.Router();

router.get("/search",getSearchLocation);

module.exports = router