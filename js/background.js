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
    
    for(let x = -segmentWidth; x <= canvas.width + segmentWidth; x += segmentWidth) {
        const noise = (
            Math.sin(x * 0.02) * 15 + 
            Math.cos(x * 0.015 * 2) * 10 +
            Math.random() * 4
        );
        surfaceNoise.push({x, y: noise});
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
  const surfaceHeight = canvas.height * 0.2;
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
