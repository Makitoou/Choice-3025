module.exports = (sequelize, Sequelize) => {
  const Player = sequelize.define("player", {
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    energy: {
      type: Sequelize.INTEGER,
      defaultValue: 100,
    },
    shields: {
      type: Sequelize.INTEGER,
      defaultValue: 75,
    },
    fuel: {
      type: Sequelize.INTEGER,
      defaultValue: 50,
    },
    currentLocation: {
      type: Sequelize.STRING,
      defaultValue: "surface",
    },
  });
  return Player;
};
