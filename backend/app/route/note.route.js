const express = require("express");
const router = express.Router();
const controller = require("../controller/note.controller.js");

var { authJwt } = require("../middleware");
router.post("/", authJwt.verifyToken, controller.create);
router.get("/save/:saveId", authJwt.verifyToken, controller.findAll);
router.put("/:id", authJwt.verifyToken, controller.update);
router.delete("/:id", authJwt.verifyToken, controller.delete);

module.exports = router;
