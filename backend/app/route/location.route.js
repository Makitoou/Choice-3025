const express = require("express");
const router = express.Router();
const controller = require("../controller/location.controller.js");

var { authJwt } = require("../middleware");
router.post("/", authJwt.verifyToken, controller.create);
router.get("/save/:saveId", authJwt.verifyToken, controller.findBySave);
router.put("/:saveId/status", authJwt.verifyToken, controller.updateStatus);

module.exports = router;
