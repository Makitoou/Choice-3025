module.exports = (sequelize, Sequelize) => {
  const Artifact = sequelize.define("artifact", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    image: {
      type: Sequelize.STRING,
    },
    value: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  return Artifact;
};
