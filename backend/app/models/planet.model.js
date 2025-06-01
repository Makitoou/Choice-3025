module.exports = (sequelize, Sequelize) => {
  const Planet = sequelize.define("planet", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM("station", "cave", "nebula", "mirror"),
      allowNull: false,
    },
    visited: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Planet;
};
