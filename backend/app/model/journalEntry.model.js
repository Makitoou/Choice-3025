// models/JournalEntry.js
module.exports = (sequelize, DataTypes) => {
  const JournalEntry = sequelize.define(
    "JournalEntry",
    {
      type: {
        type: DataTypes.ENUM("story", "event", "system"),
        defaultValue: "story",
      },
      content: DataTypes.TEXT, // Текст записи
      importance: DataTypes.INTEGER, // Уровень важности (1-5)
    },
    { timestamps: true }
  );

  JournalEntry.associate = (models) => {
    JournalEntry.belongsTo(models.Save);
  };
  return JournalEntry;
};
