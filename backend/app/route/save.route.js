// routes/save.js
const express = require("express");
const router = express.Router();
const controller = require("../controller/save.controller.js");

const authJwt = require("../middleware/authJwt.js");
router.get("/latest", authJwt.verifyToken, controller.getLatest);
router.get("/:id", authJwt.verifyToken, controller.findOne);
router.put("/:id", authJwt.verifyToken, controller.update);
router.post("/init", authJwt.verifyToken, controller.initSave);
router.post("/", authJwt.verifyToken, controller.create);
router.get("/", authJwt.verifyToken, controller.findAll);
router.delete("/:id", authJwt.verifyToken, controller.delete);

module.exports = router;
