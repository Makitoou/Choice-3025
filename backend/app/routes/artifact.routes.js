module.exports = (app) => {
  const artifact = require("../controllers/artifact.controller.js");

  var router = require("express").Router();

  router.post("/", artifact.create);
  router.put("/:playerId/collect/:artifactId", artifact.collectArtifact);

  app.use("/api/artifacts", router);
};
