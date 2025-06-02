const express = require("express");
const router = express.Router();
const controller = require("../controller/settings.controller.js");

var { authJwt } = require("../middleware");
router.put("/", authJwt.verifyToken, controller.update);
router.get("/", authJwt.verifyToken, controller.findByUser);

module.exports = router;
