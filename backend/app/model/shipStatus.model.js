module.exports = (sequelize, DataTypes) => {
  const ShipStatus = sequelize.define("ShipStatus", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shields: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    fuel: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  });

  return ShipStatus;
};
