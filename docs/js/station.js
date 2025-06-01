// station.js
const canvas = document.getElementById("stationCanvas");
const ctx = canvas.getContext("2d");

const SPEED_FACTOR = 0.2;
let lastTime = 0;
let stars = [];
let planets = [];
let surfaceHeightValue = 0.35;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
  draw();
}

function init() {
  // Генерация звезд (как в background.js)
  stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    opacity: Math.random(),
    speed: 0.1 + Math.random() * 0.3,
  }));

  // Генерация планет по вашим требованиям
  planets = [
    {
      // Бирюзовая планета слева
      x: canvas.width * 0.2,
      y: canvas.height * 0.4,
      radius: 150,
      color: "#00FFFF",
      rings: false,
      glow: true,
      speedX: 0,
      speedY: 0,
    },
    {
      // Коричневая планета справа
      x: canvas.width * 0.8,
      y: canvas.height * 0.2,
      radius: 300,
      color: "#8B4513",
      rings: false,
      glow: true,
      speedX: 0,
      speedY: 0,
    },
    {
      // Горчичная планета по центру
      x: canvas.width * 0.5,
      y: canvas.height * 0.35,
      radius: 50,
      color: "#808000",
      rings: true,
      glow: false,
      speedX: 0,
      speedY: 0,
    },
  ];
}

// Функции из background.js для работы с цветами планет
function lightenColor(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return `#${(
    0x1000000 +
    (R > 0 ? (R < 255 ? R : 255) : 0) * 0x10000 +
    (G > 0 ? (G < 255 ? G : 255) : 0) * 0x100 +
    (B > 0 ? (B < 255 ? B : 255) : 0)
  )
    .toString(16)
    .slice(1)}`;
}

function createPlanetGradient(ctx, planet) {
  const gradient = ctx.createRadialGradient(
    planet.x - planet.radius * 0.2,
    planet.y - planet.radius * 0.3,
    0,
    planet.x,
    planet.y,
    planet.radius
  );

  // Осветленный цвет для центра
  const lightColor = lightenColor(planet.color, 60);
  // Темный цвет для краев
  const darkColor = darkenColor(planet.color, 50);

  gradient.addColorStop(0, lightColor);
  gradient.addColorStop(1, darkColor);

  return gradient;
}

function updatePositions(deltaTime) {
  // Обновляем позиции звезд (как в background.js)
  stars.forEach((star) => {
    star.y += star.speed * SPEED_FACTOR * deltaTime;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

function draw() {
  // Очистка холста
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рисуем звезды (как в background.js)
  stars.forEach((star) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Рисуем планеты (как в background.js)
  planets.forEach((planet) => {
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);

    if (planet.glow) {
      ctx.shadowColor = planet.color;
      ctx.shadowBlur = 50;
    }

    ctx.fillStyle = createPlanetGradient(ctx, planet);
    ctx.fill();

    // Рисуем кольца, если нужно
    if (planet.rings) {
      ctx.beginPath();
      ctx.ellipse(
        planet.x,
        planet.y,
        planet.radius * 1.5,
        planet.radius * 0.3,
        Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `hsla(45, 80%, 60%, 0.4)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  });

  // Рисуем фиолетовую поверхность (как в оригинальном station.js)
  const surfaceHeight = canvas.height * surfaceHeightValue;
  const y = canvas.height - surfaceHeight;

  // Градиент для поверхности
  const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
  gradient.addColorStop(0, "#8A2BE2");
  gradient.addColorStop(1, "#4B0082");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, y, canvas.width, surfaceHeight);

  surfaceRectangles = [];
  for (let x = 0; x < canvas.width; x += 20) {
    surfaceRectangles.push({ x: x, y: 0, width: 10, height: 10 });
  }

  // Текстура поверхности
  ctx.fillStyle = "#FFFFFF10";
  surfaceRectangles.forEach((rectangle) => {
    ctx.fillRect(
      rectangle.x,
      y + Math.random() * surfaceHeight,
      rectangle.width,
      rectangle.height
    );
  });
}

function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) * 0.1;
  lastTime = timestamp;

  updatePositions(deltaTime);
  draw();
  requestAnimationFrame(animate);
}

// Инициализация
window.addEventListener("load", () => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  animate(0);
});
