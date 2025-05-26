document.addEventListener("DOMContentLoaded", () => {
  // document.getElementById("play").addEventListener("click", () => {
  //   const grid = document.createElement("div");
  //   grid.classList.add("grid");
  //   document.querySelector("#playfield .field").appendChild(grid);
  //   play();
  //   document.getElementById("menu").classList.add("hidden");
  //   setTimeout(() => {
  //     document.getElementById("menu").style.display = "none";
  //     document.getElementById("playfield").style.display = "flex";
  //     setTimeout(() => {
  //       document.getElementById("playfield").classList.remove("hidden");
  //     }, 100);
  //   }, 300);
  // });

  // document.getElementById("open-settings").addEventListener("click", () => {
  //   document.getElementById("menu").classList.add("hidden");
  //   setTimeout(() => {
  //     document.getElementById("menu").style.display = "none";
  //     document.getElementById("settings").style.display = "flex";
  //     setTimeout(() => {
  //       document.getElementById("settings").classList.remove("hidden");
  //     }, 100);
  //   }, 300);
  // });

  // document.getElementById("open-rate").addEventListener("click", () => {
  //   document.getElementById("menu").classList.add("hidden");
  //   setTimeout(() => {
  //     document.getElementById("menu").style.display = "none";
  //     document.getElementById("rate").style.display = "flex";
  //     setTimeout(() => {
  //       document.getElementById("rate").classList.remove("hidden");
  //     }, 100);
  //   }, 300);
  // });

  // Array.from(document.getElementsByClassName("open-menu")).forEach((el) => {
  //   el.addEventListener("click", () => {
  //     document.getElementById("playfield").classList.add("hidden");
  //     document.getElementById("settings").classList.add("hidden");
  //     document.getElementById("rate").classList.add("hidden");
  //     setTimeout(() => {
  //       document.getElementById("playfield").style.display = "none";
  //       if (document.querySelector(".grid")) {
  //         document.querySelector(".grid").remove();
  //       }
  //       document.getElementById("settings").style.display = "none";
  //       document.getElementById("rate").style.display = "none";
  //       document.getElementById("menu").style.display = "flex";
  //       setTimeout(() => {
  //         document.getElementById("menu").classList.remove("hidden");
  //       }, 100);
  //     }, 300);
  //   });
  // });
  const canvas = document.getElementById("spaceCanvas");
  const ctx = canvas.getContext("2d");

  const SPEED_FACTOR = 0.2;
  let lastTime = 0;
  let stars = [];

  function init() {
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      opacity: 1,
      targetOpacity: Math.random(),
      speed: 0.1 + Math.random() * 0.3,
      blinkSpeed: 0.02 + Math.random() * 0.01,
    }));
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

      if (Math.random() < 0.02) {
        star.targetOpacity = Math.random() * 0.8 + 0.2;
      }
      star.opacity += (star.targetOpacity - star.opacity) * star.blinkSpeed;
    });
  }

  function drawStars() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) * 0.1;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePositions(deltaTime);
    drawStars();
    requestAnimationFrame(animate);
  }

  animate(0);
});
