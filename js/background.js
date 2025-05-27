let surfaceHeightValue = 0.2;
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("../json/prehistory.json");
  const data = await response.json();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const dialogContainer = document.getElementById("dialogContainer");
  const dialogText = document.getElementById("dialogText");

  dialogContainer.classList.add("dialog-visible");
  typewriterEffect(dialogText, data.dialog, 50, false, true);
});

function typewriterEffect(
  element,
  text,
  speed = 50,
  isFinal = false,
  isGreeting = false
) {
  let i = 0;
  element.innerHTML = "";
  toggleButtons(true);

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
      element.parentElement.scrollTop = element.parentElement.scrollHeight;
      i++;
      setTimeout(type, speed);
    } else if (isFinal || isGreeting) {
      // Добавлен флаг isGreeting
      setTimeout(() => {
        const dialogContainer = document.getElementById("dialogContainer");
        const alienContainer = document.getElementById("alienContainer");

        if (isGreeting) {
          // Блокируем Исследовать и Улететь после приветствия
          document.getElementById("exploreButton").disabled = true;
          document.getElementById("leaveButton").disabled = true;
          document.getElementById("talkButton").disabled = false;
        } else {
          // Стандартная логика для финальных ответов
          dialogContainer.classList.add("hidden");
          alienContainer.classList.add("exit");

          setTimeout(() => {
            dialogContainer.style.display = "none";
            alienContainer.style.display = "none";
            document.getElementById("talkButton").disabled = true;
            document.getElementById("leaveButton").disabled = true;
            document.getElementById("exploreButton").disabled = false;
          }, 1500);
        }
      }, 500);
    } else {
      toggleButtons(false);
    }
  }
  type();
}

const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

const SPEED_FACTOR = 0.2;
let lastTime = 0;

let stars = [];
let planets = [];
let surfaceNoise = [];

function generateSurfaceNoise() {
  const segmentWidth = 15;
  surfaceNoise = [];

  for (
    let x = -segmentWidth;
    x <= canvas.width + segmentWidth;
    x += segmentWidth
  ) {
    const noise = 0;
    surfaceNoise.push({ x, y: noise });
  }
}

function init() {
  // Генерация звезд
  stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    opacity: Math.random(),
    speed: 0.1 + Math.random() * 0.3,
  }));

  // Генерация статичных планет
  planets = [
    {
      x: canvas.width * 0.15,
      y: canvas.height / 1.8,
      radius: 400,
      color: "#0000FF",
      rings: true,
      glow: true,
      speedX: 0,
      speedY: 0,
    },
    {
      x: canvas.width * 0.85,
      y: canvas.height * 0.15,
      radius: 130,
      color: "#808000",
      rings: true,
      glow: false,
      speedX: 0,
      speedY: 0,
    },
    {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 100,
      color: "#00FFFF",
      rings: false,
      glow: true,
      speedX: 0,
      speedY: 0,
    },
  ];
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function updatePositions(deltaTime) {
  stars.forEach((star) => {
    star.y += star.speed * SPEED_FACTOR * deltaTime;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

function draw() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  planets.forEach((planet) => {
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);

    if (planet.glow) {
      ctx.shadowColor = planet.color;
      ctx.shadowBlur = 50;
    }

    ctx.fillStyle = planet.color;
    ctx.fill();

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

  generateSurfaceNoise();
  const surfaceHeight = canvas.height * surfaceHeightValue;
  const baseY = canvas.height - surfaceHeight;

  ctx.beginPath();
  ctx.moveTo(-50, canvas.height);
  ctx.lineTo(-50, baseY + 50);

  surfaceNoise.forEach((point, i) => {
    const cy = baseY + point.y;
    if (i === 0) {
      ctx.lineTo(point.x, cy);
    } else {
      const prev = surfaceNoise[i - 1];
      const cpx = (prev.x + point.x) / 2;
      const cpy = (prev.y + point.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y + baseY, point.x, cy);
    }
  });

  ctx.lineTo(canvas.width + 50, canvas.height);
  ctx.closePath();

  const surfaceGradient = ctx.createLinearGradient(0, baseY, 0, canvas.height);
  surfaceGradient.addColorStop(0, "#3A332D");
  surfaceGradient.addColorStop(1, "#2E2A24");
  ctx.fillStyle = surfaceGradient;
  ctx.fill();

  ctx.beginPath();
  surfaceNoise.forEach((point, i) => {
    const cy = baseY + point.y;
    if (i === 0) {
      ctx.moveTo(point.x, cy);
    } else {
      ctx.lineTo(point.x, cy);
    }
  });
  ctx.strokeStyle = "#211E1B";
  ctx.lineWidth = 3;
  ctx.stroke();
}
function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) * 0.1;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePositions(deltaTime);
  draw();
  requestAnimationFrame(animate);
}

animate(0);

//Карта

const canvas_map = document.getElementById("gameCanvas");
const ctx_map = canvas_map.getContext("2d");

document.getElementById("mapButton").addEventListener("click", () => {
  document.body.classList.add("map-visible");
  resizeCanvas();
  canvas_map.width = mapWidth;
  canvas_map.height = mapHeight;
  draw_map();
});

document.querySelector(".close-btn").addEventListener("click", () => {
  document.body.classList.remove("d-block");
});

// Размеры карты
const mapWidth = 600;
const mapHeight = 400;
const cornerRadius = 0;

// Цвета
const colors = {
  background: "#483d8b",
  planets_color: ["#0000FF", "#808000", "#00FFFF", "#211E1B"],
};

// Позиции планет
const planets_map = [
  { x: 0.1, y: 0.2 }, // top-left
  { x: 0.5, y: 0.2 }, // top-right
  { x: 0.8, y: 0.4 }, // bottom-right
  { x: 0.2, y: 0.8 }, // bottom-left
];

function drawRoundedRect(x, y, width, height, radius) {
  ctx_map.beginPath();
  ctx_map.moveTo(x + radius, y);
  ctx_map.arcTo(x + width, y, x + width, y + height, radius);
  ctx_map.arcTo(x + width, y + height, x, y + height, radius);
  ctx_map.arcTo(x, y + height, x, y, radius);
  ctx_map.arcTo(x, y, x + width, y, radius);
  ctx_map.closePath();
  ctx_map.fillStyle = "#D9D9D9";
  ctx_map.fill();
}

function drawConnections(mapX, mapY) {
  ctx_map.beginPath();
  // Горизонтальные линии
  ctx_map.moveTo(mapX + mapWidth * 0.1, mapY + mapHeight * 0.2);
  ctx_map.lineTo(mapX + mapWidth * 0.5, mapY + mapHeight * 0.2);

  ctx_map.moveTo(mapX + mapWidth * 0.2, mapY + mapHeight * 0.8);
  ctx_map.lineTo(mapX + mapWidth * 0.8, mapY + mapHeight * 0.4);

  // Вертикальные линии
  ctx_map.moveTo(mapX + mapWidth * 0.1, mapY + mapHeight * 0.2);
  ctx_map.lineTo(mapX + mapWidth * 0.2, mapY + mapHeight * 0.8);

  ctx_map.moveTo(mapX + mapWidth * 0.5, mapY + mapHeight * 0.2);
  ctx_map.lineTo(mapX + mapWidth * 0.8, mapY + mapHeight * 0.4);

  // Диагонали
  ctx_map.moveTo(mapX + mapWidth * 0.1, mapY + mapHeight * 0.2);
  ctx_map.lineTo(mapX + mapWidth * 0.8, mapY + mapHeight * 0.4);

  ctx_map.moveTo(mapX + mapWidth * 0.5, mapY + mapHeight * 0.2);
  ctx_map.lineTo(mapX + mapWidth * 0.2, mapY + mapHeight * 0.8);

  ctx_map.strokeStyle = "black";
  ctx_map.lineWidth = 2;
  ctx_map.stroke();
}
const planetRadii = {
  "#00FFFF": 20,
  "#808000": 30,
  "#0000FF": 40,
  "#211E1B": 50,
};
function drawPlanets(mapX, mapY) {
  planets_map.forEach((pos, i) => {
    ctx_map.beginPath();
    const radius = planetRadii[colors.planets_color[i]] || 20;
    ctx_map.arc(
      mapX + mapWidth * pos.x,
      mapY + mapHeight * pos.y,
      radius,
      0,
      Math.PI * 2
    );
    ctx_map.fillStyle = colors.planets_color[i];
    ctx_map.fill();
  });
}

function draw_map() {
  ctx_map.fillStyle = colors.background;
  ctx_map.fillRect(0, 0, canvas_map.width, canvas_map.height);

  const scaleX = canvas_map.width / 600;
  const scaleY = canvas_map.height / 400;

  ctx_map.save();
  ctx_map.scale(scaleX, scaleY);
  drawRoundedRect(0, 0, 600, 400, 50);
  drawConnections(0, 0);
  drawPlanets(0, 0);
  ctx_map.restore();
}

window.addEventListener("resize", () => {
  draw_map();
});

draw_map();
let hoveredPlanet = null;

function getPlanetPositions() {
  const rect = canvas_map.getBoundingClientRect();
  const scaleX = canvas_map.width / 600;
  const scaleY = canvas_map.height / 400;

  return planets_map.map((pos, i) => ({
    x: pos.x * 600 * scaleX,
    y: pos.y * 400 * scaleY,
    radius: planetRadii[colors.planets_color[i]] * Math.min(scaleX, scaleY),
    color: colors.planets_color[i],
  }));
}

canvas_map.addEventListener("mousemove", (e) => {
  const rect = canvas_map.getBoundingClientRect();
  const scaleX = canvas_map.width / 600;
  const scaleY = canvas_map.height / 400;

  const mouseX = (e.clientX - rect.left) / scaleX;
  const mouseY = (e.clientY - rect.top) / scaleY;

  hoveredPlanet = planets_map.find((pos, i) => {
    const planetX = pos.x * 600;
    const planetY = pos.y * 400;
    const radius = planetRadii[colors.planets_color[i]];
    return Math.hypot(mouseX - planetX, mouseY - planetY) < radius;
  });

  draw_map();
  if (hoveredPlanet) drawHoverEffect();
});

canvas_map.addEventListener("mouseout", () => {
  hoveredPlanet = null;
  draw_map();
});

function drawHoverEffect() {
  if (!hoveredPlanet) return;

  const scaleX = canvas_map.width / 600;
  const scaleY = canvas_map.height / 400;
  const radius = planetRadii[hoveredPlanet.color] * Math.min(scaleX, scaleY);

  ctx_map.save();
  ctx_map.beginPath();
  ctx_map.arc(
    hoveredPlanet.x * 600 * scaleX,
    hoveredPlanet.y * 400 * scaleY,
    radius * 1.2,
    0,
    Math.PI * 2
  );
  ctx_map.fillStyle = `rgba(255, 255, 255, 0.3)`;
  ctx_map.fill();
  ctx_map.restore();
}
async function loadPrehistory() {
  const response = await fetch("../json/prehistory.json");
  return await response.json();
}

async function showDialogOptions() {
  const data = await loadPrehistory();
  const dialogOptions = document.getElementById("dialogOptions");
  dialogOptions.innerHTML = `
  <div class="d-flex justify-content-center gap-3">
    <button class="btn btn-lg" data-answer="positive">${data["positive-answer"]}</button>
    <button class="btn btn-lg" data-answer="neutral">${data["neutral-answer"]}</button>
    <button class="btn btn-lg" data-answer="negative">${data["negative-answer"]}</button>
  </div>
`;
  dialogOptions.style.display = "block";

  document.querySelectorAll("#dialogOptions button").forEach((button) => {
    button.addEventListener("click", async () => {
      const answerType = button.getAttribute("data-answer");
      const dialogContainer = document.getElementById("dialogContainer");
      const dialogText = document.getElementById("dialogText");

      let responseKey;
      switch (answerType) {
        case "positive":
          responseKey = "alien-talk-research";
          break;
        case "negative":
          responseKey = "alien-talk-leave";
          break;
        case "neutral":
          responseKey = "alien-talk-neutral";
          break;
      }

      dialogText.innerHTML = "";
      typewriterEffect(dialogText, data[responseKey], 50, true);

      const dialogOptions = document.getElementById("dialogOptions");
      dialogOptions.style.display = "none";
    });
  });
}

// Обработчик кнопки "Поговорить"
document.getElementById("talkButton").addEventListener("click", () => {
  toggleButtons(true);
  showDialogOptions();
});
dialogContainer.classList.add("dialog-hidden");

document.querySelectorAll("#dialogOptions button").forEach((button) => {
  button.addEventListener("click", () => {
    toggleButtons(true);
    dialogContainer.classList.remove("dialog-visible");
    const dialogOptions = document.getElementById("dialogOptions");
    const answer = button.getAttribute("data-answer");
    console.log(`Выбран ответ: ${answer} - ${button.textContent}`);
    dialogOptions.style.display = "none";

    const dialogContainer = document.getElementById("dialogContainer");
    dialogContainer.classList.remove(".dialog-visible");
  });
});
// Функция для блокировки/разблокировки кнопок
function toggleButtons(state) {
  const buttons = ["exploreButton", "talkButton", "leaveButton"];
  buttons.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = state;
  });
}
let isExploreButtonClicked = false;
document.getElementById("exploreButton").addEventListener("click", () => {
  if (!isExploreButtonClicked) {
    planets.forEach((planet) => {
      animatePlanetSize(planet, planet.radius * 0.5, 1000);
    });
    animateSurfaceSize(0.5, 2000);
    isExploreButtonClicked = true;
    document.getElementById("exploreButton").disabled = true;
  }
});
function animatePlanetSize(planet, newSize, duration) {
  const startSize = planet.radius;
  const startTime = Date.now();
  const animation = () => {
    const currentTime = Date.now();
    const progress = (currentTime - startTime) / duration;
    planet.radius = startSize + (newSize - startSize) * progress;
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };
  animation();
  document.getElementById("exploreButton").style.display = "none";
  document.getElementById("talkButton").style.display = "none";
  document.getElementById("leaveButton").style.display = "none";
}
function animateSurfaceSize(newSize, duration) {
  const startHeight = surfaceHeightValue;
  const targetHeight = 0.4;
  const startTime = Date.now();
  const animation = () => {
    const currentTime = Date.now();
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const newHeight = startHeight + (newSize - startHeight) * progress;
    surfaceNoise.forEach((point) => {
      point.y = 0;
    });
    surfaceHeightValue = startHeight + (targetHeight - startHeight) * progress;
    const surfaceHeight = canvas.height - newHeight;
    ctx.beginPath();
    ctx.moveTo(-50, canvas.height);
    ctx.lineTo(-50, surfaceHeight + 50);
    surfaceNoise.forEach((point, i) => {
      const cy = surfaceHeight + point.y;
      if (i === 0) {
        ctx.lineTo(point.x, cy);
      } else {
        const prev = surfaceNoise[i - 1];
        const cpx = (prev.x + point.x) / 2;
        const cpy = (prev.y + point.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y + surfaceHeight, point.x, cy);
      }
    });
    ctx.lineTo(canvas.width + 50, canvas.height);
    ctx.closePath();
    ctx.fillStyle = `#3A332D`;
    ctx.fill();
    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      surfaceHeightValue = targetHeight;
    }
  };
  animation();
}