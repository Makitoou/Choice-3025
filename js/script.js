document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("play").addEventListener("click", () => {
    const grid = document.createElement("div");
    grid.classList.add("grid")
    document.querySelector("#playfield .field").appendChild(grid);
    play();
    document.getElementById("menu").classList.add('hidden');
    setTimeout(() => {
      document.getElementById("menu").style.display = 'none';
      document.getElementById("playfield").style.display = 'flex';
      setTimeout(() => {
        document.getElementById("playfield").classList.remove('hidden');
      }, 100);
    }, 300);
  });

  document.getElementById("open-settings").addEventListener("click", () => {
    document.getElementById("menu").classList.add('hidden');
    setTimeout(() => {
      document.getElementById("menu").style.display = 'none';
      document.getElementById("settings").style.display = 'flex';
      setTimeout(() => {
        document.getElementById("settings").classList.remove('hidden');
      }, 100);
    }, 300);
  });

  document.getElementById("open-rate").addEventListener("click", () => {
    document.getElementById("menu").classList.add('hidden');
    setTimeout(() => {
      document.getElementById("menu").style.display = 'none';
      document.getElementById("rate").style.display = 'flex';
      setTimeout(() => {
        document.getElementById("rate").classList.remove('hidden');
      }, 100);
    }, 300);
  });

  Array.from(document.getElementsByClassName("open-menu")).forEach((el) => {
    el.addEventListener("click", () => {
      document.getElementById("playfield").classList.add('hidden');
      document.getElementById("settings").classList.add('hidden');
      document.getElementById("rate").classList.add('hidden');
      setTimeout(() => {
        document.getElementById("playfield").style.display = 'none';
        if (document.querySelector(".grid")) {
          document.querySelector(".grid").remove();
        }
        document.getElementById("settings").style.display = 'none';
        document.getElementById("rate").style.display = 'none';
        document.getElementById("menu").style.display = 'flex';
        setTimeout(() => {
          document.getElementById("menu").classList.remove('hidden');
        }, 100);
      }, 300);
    });
  });
});
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