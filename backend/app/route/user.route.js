const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller.js");

var { authJwt } = require("../middleware");
router.post("/register", controller.register);
router.get("/profile", controller.profile);
router.put("/update", controller.update);

module.exports = router;
