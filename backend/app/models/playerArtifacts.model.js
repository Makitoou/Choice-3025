module.exports = (sequelize, Sequelize) => {
  const PlayerArtifacts = sequelize.define("playerArtifacts", {
    collected: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    positionX: Sequelize.INTEGER,
    positionY: Sequelize.INTEGER,
  });
  return PlayerArtifacts;
};
