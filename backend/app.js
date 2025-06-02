const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://makitoou.github.io"];
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Handle preflight requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    return res.status(200).json({});
  }
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Простая маршрутизация
app.get("/", (req, res) => {
  res.json({ message: "Space Game API" });
});

// Подключаем маршруты
require("../app/routes/auth.routes")(app);
require("../app/routes/player.routes")(app);
require("../app/routes/artifact.routes")(app);

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
