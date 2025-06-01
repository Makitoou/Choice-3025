const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Простая маршрутизация
app.get("/", (req, res) => {
  res.json({ message: "Space Game API" });
});

// Подключаем маршруты
require("./app/routes/player.routes")(app);
require("./app/routes/artifact.routes")(app);

// Установка порта
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Инициализация БД
const db = require("./app/models");
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");

  // Инициализация начальных данных
  initial();
});

function initial() {
  // Создание начальных планет
  const planets = [
    { name: "Станция", type: "station" },
    { name: "Пещера", type: "cave" },
    { name: "Туманность", type: "nebula" },
    { name: "Зеркало", type: "mirror" },
  ];

  planets.forEach((planet) => {
    db.planet.create(planet);
  });

  // Создание начальных артефактов
  const artifacts = [
    { name: "Обломки металла", image: "bar.png" },
    { name: "Записки", image: "file.png" },
    { name: "Кристаллы", image: "diamonds.png" },
  ];

  artifacts.forEach((artifact) => {
    db.artifact.create(artifact);
  });
}
