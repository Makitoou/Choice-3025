const express = require("express");
const router = express.Router();
const controller = require("../controller/saveLocations.controller.js");

var { authJwt } = require("../middleware");
router.put("/:saveId/:locationId", authJwt.verifyToken, controller.update);

module.exports = router;
