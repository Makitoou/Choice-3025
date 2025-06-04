const express = require("express");
const router = express.Router();
const controller = require("../controller/inventory.controller.js");

var { authJwt } = require("../middleware/index.js");
router.post("/", authJwt.verifyToken, controller.create);
router.get("/save/:saveId", authJwt.verifyToken, controller.findAll);
router.put("/:id", authJwt.verifyToken, controller.update);
router.delete("/:id", authJwt.verifyToken, controller.delete);
router.post("/use", authJwt.verifyToken, controller.useItem);
router.post("/add", authJwt.verifyToken, controller.addItemToInventory);

module.exports = router;
