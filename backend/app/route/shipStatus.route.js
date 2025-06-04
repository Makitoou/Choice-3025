const controller = require("../controller/shipStatus.controller.js");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", [authJwt.verifyToken], controller.getStatus);
  router.put("/", [authJwt.verifyToken], controller.updateStatus);

  app.use("/api/ship-status", router);
};
