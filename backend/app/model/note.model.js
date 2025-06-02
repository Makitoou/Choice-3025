// models/Note.js
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Note",
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      category: DataTypes.STRING, // "Ресурсы", "Квесты" и т.д.
    },
    { timestamps: true }
  );

  Note.associate = (models) => {
    Note.belongsTo(models.Save);
  };
  return Note;
};
