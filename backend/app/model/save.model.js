// models/Save.js
module.exports = (sequelize, DataTypes) => {
  const Save = sequelize.define("Save", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Автосохранение",
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  resources: DataTypes.JSON,
  gameState: {
    type: DataTypes.JSON,
    defaultValue: {}, // важно!
  },
  isAutosave: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});


  Save.associate = (models) => {
    Save.belongsTo(models.User);
    Save.hasMany(models.Inventory);
    Save.hasMany(models.JournalEntry);
    Save.hasMany(models.Note);
    Save.belongsToMany(models.Location, { through: "SaveLocations" });
  };
  return Save;
};
