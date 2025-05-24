const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];

function createStar() {
  return {
    x: Math.random() * canvas.width,
    y: 0,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.1
  };
}

for (let i = 0; i < 100; i++) {
  stars.push(createStar());
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star, index) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"; /* Уменьшаем яркость звезд */
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height) {
      stars[index] = createStar();
    }
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars.length = 0;
  for (let i = 0; i < 100; i++) {
    stars.push(createStar());
  }
});