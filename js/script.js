let cutsceneShown = false;
document.addEventListener("DOMContentLoaded", () => {
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
  const playButton = document.getElementById("play-btn");
  let isIntroShown = localStorage.getItem("introShown");

  if (isIntroShown) {
    playButton.onclick = () => window.open("html/play.html", "_self");
    return;
  }

  playButton.addEventListener("click", async (e) => {
    e.preventDefault();
    let typewriter;
    let data;
    let shouldShowCutscene = false;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      color: #8A2BE2;
      font-family: 'Space Mono', monospace;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20%;
      text-align: center;
      font-size: 1.5rem;
      line-height: 2;
      cursor: pointer;
      opacity: 1;
      transition: opacity 0.5s ease;
    `;
    const skipBtn = document.createElement("div");
    skipBtn.textContent = "[ESC] Пропустить";
    skipBtn.style.cssText = `
      position: absolute;
      bottom: 20px;
      right: 20px;
      color: #8A2BE2;
      opacity: 0.7;
      cursor: pointer;
      font-size: 1rem;
      transition: opacity 0.5s;
    `;
    skipBtn.onmouseover = () => (skipBtn.style.opacity = "1");
    skipBtn.onmouseout = () => (skipBtn.style.opacity = "0.7");

    const textContainer = document.createElement("div");

    let isSkipped = false;
    const skipHandler = () => {
      if (isSkipped || !data) return;
      isSkipped = true;
      if (typewriter) {
        typewriter.stop();
      }

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 1000;
      `;
      document.body.appendChild(overlay);
      setTimeout(() => {
        window.open("./html/play.html", "_self");
      }, 3000);
    };
    skipBtn.addEventListener("click", skipHandler);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") skipHandler();
    });
    overlay.appendChild(skipBtn);
    overlay.style.display = "flex";
    textContainer.style.visibility = "hidden";
    overlay.appendChild(textContainer);
    document.body.appendChild(overlay);

    try {
      const response = await fetch("./json/prehistory.json");
      data = await response.json();
      textContainer.style.visibility = "visible";

      typewriter = typewriterEffect(textContainer, data.intro, 70);
      await typewriter;
      
      if (shouldShowCutscene || !cutsceneShown) {
        showCutscene();
        cutsceneShown = true;
        setTimeout(() => {
          window.open("./html/play.html", "_self");
        }, 5000); // время показа кат-сцены в миллисекундах
      }
      localStorage.setItem("introShown", "true");
      window.addEventListener("load", function () {
        document.body.style.filter = "";
        document.body.style.transition = "";
      });
    } catch (error) {
      console.error("Ошибка:", error);
      window.open("./html/play.html", "_self");
    }
  });
});

function typewriterEffect(element, text, speed = 50) {
  let isTyping = true;
  let resolvePromise;
  let shouldShowCutscene = false;

  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
    let i = 0;

    function skipHandler(e) {
      if (e.key === "Escape") {
        i = text.length;
        element.innerHTML = text.replace(/\n/g, "<br>");
        document.removeEventListener("keydown", skipHandler);
        setTimeout(() => {
          resolvePromise();
          shouldShowCutscene = true;
        }, 3000);
      }
    }

    document.addEventListener("keydown", skipHandler);

    function type() {
      if (!isTyping) return resolve();
      if (i < text.length) {
        element.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
        element.scrollTop = element.scrollHeight;
        i++;
        setTimeout(type, speed);
      } else {
        document.removeEventListener("keydown", skipHandler);
        resolve();
      }
    }
    type();
  });

  promise.stop = () => {
    isTyping = false;
    resolvePromise();
  };

  promise.shouldShowCutscene = () => shouldShowCutscene;

  return promise;
}

function showCutscene() {
  const existing = document.getElementById("cutscene");
  if (existing) existing.remove();

  const cutscene = document.createElement("div");
  cutscene.id = "cutscene";
  cutscene.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    pointer-events: none;
    background-image: url('./images/stars.png');
    background-size: cover;
    background-position: center;
  `;

  const panel = document.createElement("img");
  panel.src = "./images/panel.png";
  panel.style.width = "100%";
  panel.style.maxWidth = "1900px";
  panel.style.top = "500px";
  panel.style.position = "relative";
  panel.style.transition = "transform 0.1s";

  panel.onerror = () => {
    panel.alt = "Панель управления";
    panel.style.backgroundColor = "#2c3e50";
    panel.style.padding = "20px";
    panel.style.color = "white";
    panel.style.textAlign = "center";
    panel.textContent = "Изображение панели управления";
  };

  const planet = document.createElement("div");
  planet.style.cssText = `
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #211a1a, #47301a);
    box-shadow: 0 0 20px rgba(221, 134, 103, 0.7);
    top: 100px;
    right: 30%;
    transition: transform 0.5s;
  `;

  cutscene.appendChild(panel);
  cutscene.appendChild(planet);
  document.body.appendChild(cutscene);

  let posY = -100;
  let scale = 0.1;
  let shakeIntensity = 3;

  const animate = () => {
    if (posY < 100) {
      posY += 2;
      scale += 0.02;
      shakeIntensity = 3 - (posY / 100) * 3;

      planet.style.bottom = `${posY}px`;
      planet.style.transform = `scale(${scale})`;
      panel.style.transform = `translate(
        ${(Math.random() - 0.5) * shakeIntensity}px, 
        ${(Math.random() - 0.5) * shakeIntensity}px
      )`;

      requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        cutscene.style.opacity = "0";
        cutscene.style.transition = "opacity 0.5s";
        setTimeout(() => {
          if (cutscene.parentNode) {
            cutscene.parentNode.removeChild(cutscene);
          }
        }, 1000);
      }, 3000);
      document.body.style.filter = "brightness(0)";
      document.body.style.transition = "filter 0.5s";
    }
  };

  animate();
}
