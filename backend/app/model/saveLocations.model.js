// models/SaveLocations.js
module.exports = (sequelize, DataTypes) => {
  const SaveLocations = sequelize.define("SaveLocations", {
    status: {
      type: DataTypes.ENUM("discovered", "current", "completed"),
      defaultValue: "discovered",
    },
  });
  return SaveLocations;
};
