let surfaceHeightValue = 0.2;
let enterImage = null;
let imagesOnSurface = [];
let selectedAnswerType = null;
let isFinalTalkPhase = false;
const urlParams = new URLSearchParams(window.location.search);
const state = urlParams.get("state");
document.addEventListener("DOMContentLoaded", async () => {
  if (state === "surface_zoomed") {
    surfaceHeightValue = 0.4;
    const alienContainer = document.getElementById("alienContainer");
    alienContainer.style.display = "none";

    document.getElementById("exploreButton").style.display = "none";
    document.getElementById("talkButton").style.display = "none";
    document.getElementById("leaveButton").style.display = "none";

    // Создаем кнопку возврата
    const returnButton = document.createElement("button");
    returnButton.id = "returnToShipButton";
    returnButton.textContent = "Вернуться к Биби";
    returnButton.className = "btn btn-outline-purple";
    returnButton.style.width = "400px";
    returnButton.style.height = "60px";
    returnButton.style.position = "fixed";
    returnButton.style.bottom = "20px";
    returnButton.style.left = "50%";
    returnButton.style.transform = "translateX(-50%)";
    returnButton.style.zIndex = "1000";
    document.body.appendChild(returnButton);

    // Создаем изображение входа
    createEnterImage();

    // Обработчик для кнопки возврата
    returnButton.addEventListener("click", async () => {
      // Удаляем изображение входа
      if (enterImage) {
        enterImage.style.opacity = "0";
        setTimeout(() => {
          if (enterImage && enterImage.parentNode) {
            enterImage.parentNode.removeChild(enterImage);
          }
          enterImage = null;
        }, 500);
      }

      // Анимация затемнения
      document.body.style.transition = "filter 1s ease";
      document.body.style.filter = "brightness(0)";

      // Анимация возврата к кораблю
      await animateReturnToShip();

      // Удаляем кнопку возврата
      returnButton.remove();

      // Убираем затемнение после завершения всех анимаций
      document.body.style.filter = "brightness(1)";

      // Ждем завершения перехода яркости
      await new Promise((resolve) => {
        document.body.addEventListener("transitionend", resolve, {
          once: true,
        });
      });

      // ПОСЛЕ полной загрузки и завершения анимаций:
      document.getElementById("alienContainer").style.display = "block";
      document.getElementById("exploreButton").style.display = "block";
      document.getElementById("talkButton").style.display = "block";
      document.getElementById("leaveButton").style.display = "block";

      // Блокируем кнопки
      document.getElementById("exploreButton").disabled = true;
      document.getElementById("talkButton").disabled = true;
      document.getElementById("leaveButton").disabled = true;

      // Убираем параметр состояния из URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Показываем ответ пришельца
      showAlienResponseAfterReturn();
    });
  } else {
    const response = await fetch("../json/prehistory.json");
    const data = await response.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dialogContainer = document.getElementById("dialogContainer");
    const dialogText = document.getElementById("dialogText");

    dialogContainer.classList.add("dialog-visible");
    typewriterEffect(dialogText, data.dialog, 50, false, true);
  }
  dialogContainer.classList.add("dialog-hidden");
  await initGame();

  if (currentPlayer) {
    updateLocation(state === "surface_zoomed" ? "surface" : "cave");
  }
});

function typewriterEffect(
  element,
  text,
  speed = 50,
  isFinal = false,
  isGreeting = false,
  callback = null
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
      setTimeout(() => {
        const dialogContainer = document.getElementById("dialogContainer");
        const alienContainer = document.getElementById("alienContainer");

        if (isGreeting) {
          document.getElementById("exploreButton").disabled = true;
          document.getElementById("leaveButton").disabled = true;
          document.getElementById("talkButton").disabled = false;
        } else {
          dialogContainer.classList.add("hidden");
          alienContainer.classList.add("exit");

          setTimeout(() => {
            dialogContainer.style.display = "none";
            alienContainer.style.display = "none";
            document.getElementById("talkButton").disabled = true;
            document.getElementById("leaveButton").disabled = true;
            document.getElementById("exploreButton").disabled = false;
          }, 1000);
        }
        if (callback) callback();
      }, 1000);
    } else {
      toggleButtons(false);
      if (callback) callback();
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
function createPlanetGradient(ctx, planet) {
  const gradient = ctx.createRadialGradient(
    planet.x - planet.radius * 0.3, // Начало градиента (смещено для эффекта освещения)
    planet.y - planet.radius * 0.3,
    0, // Начальный радиус
    planet.x,
    planet.y,
    planet.radius // Конечный радиус
  );

  // Осветленный цвет для центра
  const lightColor = lightenColor(planet.color, 80);

  // Темный цвет для краев
  const darkColor = darkenColor(planet.color, 40);

  gradient.addColorStop(0, lightColor);
  gradient.addColorStop(1, darkColor);

  return gradient;
}

// Вспомогательные функции для изменения яркости цвета
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

    // Замена сплошного цвета на градиент
    ctx.fillStyle = createPlanetGradient(ctx, planet);
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
  surfaceGradient.addColorStop(0, "#211a1a");
  surfaceGradient.addColorStop(0.5, "#332619");
  surfaceGradient.addColorStop(1, "#47301a");
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

animate(0);

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
      selectedAnswerType = answerType;

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
      areImagesVisible = false;
      if (!areImagesVisible) {
        createEnterImage();
        // createSurfaceImages();
        areImagesVisible = true;
      }
    }
  };
  animation();
}
window.addEventListener("resize", () => {
  const surfaceY = canvas.height - canvas.height * surfaceHeightValue;

  imagesOnSurface.forEach((img, index) => {
    const originalY = imagesData[index].y;
    img.style.bottom = `${surfaceY - originalY}px`;

    img.style.left = `${imagesData[index].x}px`;
  });
});
function createEnterImage() {
  // Если изображение уже существует, удаляем его
  if (enterImage) {
    enterImage.remove();
  }

  enterImage = document.createElement("img");
  enterImage.src = "../images/enter.png";
  enterImage.className = "surface-image";
  enterImage.style.position = "fixed";
  enterImage.style.left = "400px";
  enterImage.style.bottom = "150px";
  enterImage.style.width = "400px";
  enterImage.style.height = "300px";
  enterImage.style.opacity = "0";
  enterImage.style.cursor = "pointer";
  enterImage.style.transition = "filter 0.5s ease";
  document.body.appendChild(enterImage);

  enterImage.onload = () => {
    enterImage.style.opacity = "1";
  };

  enterImage.addEventListener("mouseover", () => {
    enterImage.style.filter = "brightness(1.2)";
  });

  enterImage.addEventListener("mouseout", () => {
    enterImage.style.filter = "";
  });

  enterImage.addEventListener("click", function () {
    document.body.style.transition = "filter 1s ease";
    document.body.style.filter = "brightness(0)";

    setTimeout(() => {
      window.location.href = "cave.html";
    }, 1000);
  });

  return enterImage;
}
document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("loaded");
});
function drawSurface(surfaceHeightParam) {
  ctx.beginPath();
  ctx.moveTo(-50, canvas.height);
  ctx.lineTo(-50, surfaceHeightParam + 50);

  generateSurfaceNoise();
  const baseY = canvas.height - surfaceHeightParam;

  surfaceNoise.forEach((point, i) => {
    const cy = baseY + point.y;
    if (i === 0) {
      ctx.lineTo(point.x, cy);
    } else {
      const prev = surfaceNoise[i - 1];
      ctx.quadraticCurveTo(prev.x, prev.y + baseY, point.x, cy);
    }
  });

  ctx.lineTo(canvas.width + 50, canvas.height);
  ctx.closePath();

  const surfaceGradient = ctx.createLinearGradient(0, baseY, 0, canvas.height);
  surfaceGradient.addColorStop(0, "#211a1a");
  surfaceGradient.addColorStop(0.5, "#332619");
  surfaceGradient.addColorStop(1, "#47301a");
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

  if (state === "surface_zoomed") {
    const surfaceHeightVal = canvas.height * surfaceHeightValue;
    drawSurface(surfaceHeightVal);
  }
  requestAnimationFrame(animate);
}
function animateReturnToShip() {
  return new Promise((resolve) => {
    const startHeight = surfaceHeightValue;
    const targetHeight = 0.2;
    const duration = 2000;
    const startTime = Date.now();

    const animation = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / duration, 1);

      surfaceHeightValue =
        startHeight + (targetHeight - startHeight) * progress;

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        surfaceHeightValue = targetHeight;
        resolve();
      }
    };

    animation();
  });
}

function finalDialogTypewriter(element, text, speed, callback) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
      element.parentElement.scrollTop = element.parentElement.scrollHeight;
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }

  type();
}

async function showAlienResponseAfterReturn() {
  const data = await loadPrehistory();
  const dialogContainer = document.getElementById("dialogContainer");
  const dialogText = document.getElementById("dialogText");

  let responseKey;
  switch (selectedAnswerType) {
    case "positive":
      responseKey = "after-research";
      break;
    case "negative":
      responseKey = "after-leave";
      break;
    case "neutral":
      responseKey = "after-neutral";
      break;
    default:
      responseKey = "after-neutral";
  }

  dialogContainer.style.display = "block";
  dialogContainer.classList.add("dialog-visible");

  // Блокируем кнопки "Исследовать" и "Улететь"
  document.getElementById("exploreButton").disabled = true;
  document.getElementById("leaveButton").disabled = true;

  // Показываем текст и затем кнопки выбора планет
  typewriterEffect(dialogText, data[responseKey], 50, false, false, () => {
    document.getElementById("exploreButton").disabled = true;
    document.getElementById("leaveButton").disabled = true;
    document.getElementById("talkButton").addEventListener("click", () => {
      document.getElementById("exploreButton").style.display = "none";
      document.getElementById("leaveButton").style.display = "none";
      document.getElementById("exploreButton").disabled = true;
      document.getElementById("leaveButton").disabled = true;
      showPlanetChoices();
    });
  });
}

async function showPlanetChoices() {
  const data = await loadPrehistory();
  const dialogOptions = document.getElementById("dialogOptions");
  const choices = data["planet-choices"];

  dialogOptions.innerHTML = `
        <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-lg" data-planet="nebula">${choices["nebula"]}</button>
            <button class="btn btn-lg" data-planet="station">${choices["station"]}</button>
            <button class="btn btn-lg" data-planet="mirror">${choices["mirror"]}</button>
            <button class="btn btn-lg" data-planet="leave">${choices["leave"]}</button>
        </div>
    `;
  dialogOptions.style.display = "block";

  document.querySelectorAll("#dialogOptions button").forEach((button) => {
    button.addEventListener("click", async () => {
      const planetType = button.getAttribute("data-planet");
      const dialogContainer = document.getElementById("dialogContainer");
      const dialogText = document.getElementById("dialogText");
      const alienContainer = document.getElementById("alienContainer");
      const talkButton = document.getElementById("talkButton");

      // Скрываем кнопки выбора
      dialogOptions.style.display = "none";

      // Используем новую функцию для печати
      finalDialogTypewriter(
        dialogText,
        data[`${planetType}-alien-talk`],
        50,
        () => {
          if (planetType === "leave") {
            // Анимация скрытия пришельца и диалога
            dialogContainer.classList.add("hidden");
            alienContainer.classList.add("exit");

            setTimeout(() => {
              dialogContainer.style.display = "none";
              alienContainer.style.display = "none";

              // Создаем кнопку "К кораблю" вместо "Поговорить"
              const returnToShipBtn = document.createElement("button");
              returnToShipBtn.id = "returnToShipBtn";
              returnToShipBtn.textContent = "К кораблю";
              returnToShipBtn.className = "btn btn-outline-purple";
              returnToShipBtn.style.width = "400px";
              returnToShipBtn.style.height = "60px";
              returnToShipBtn.style.margin = "0 10px";

              // Заменяем кнопку "Поговорить"
              talkButton.parentNode.replaceChild(returnToShipBtn, talkButton);

              // Обработчик для кнопки "К кораблю"
              returnToShipBtn.addEventListener("click", function () {
                // Анимация затемнения фона
                const darkOverlay = document.createElement("div");
                darkOverlay.id = "darkOverlay";
                darkOverlay.style.position = "fixed";
                darkOverlay.style.top = "0";
                darkOverlay.style.left = "0";
                darkOverlay.style.width = "100%";
                darkOverlay.style.height = "100%";
                darkOverlay.style.backgroundColor = "rgba(0,0,0,0.7)";
                darkOverlay.style.zIndex = "999";
                darkOverlay.style.opacity = "0";
                darkOverlay.style.transition = "opacity 1s ease";
                document.body.appendChild(darkOverlay);

                // Создаем элемент корабля
                const spacecraft = document.createElement("img");
                spacecraft.id = "spacecraftImage";
                spacecraft.src = "../images/spacecraft.png";
                spacecraft.alt = "Spacecraft";
                spacecraft.style.position = "fixed";
                spacecraft.style.bottom = "50px";
                spacecraft.style.width = "400px";
                spacecraft.style.height = "800px";
                spacecraft.style.opacity = "0";
                spacecraft.style.zIndex = "1002";
                spacecraft.style.transition =
                  "left 1.5s ease, opacity 1.5s ease";
                document.body.appendChild(spacecraft);

                // Плавное появление корабля
                setTimeout(() => {
                  spacecraft.style.left = "200px";
                  spacecraft.style.opacity = "1";
                }, 300);

                // Добавляем обработчики событий на корабль
                spacecraft.addEventListener("mouseover", () => {
                  spacecraft.style.filter = "brightness(1.2)";
                });
                spacecraft.addEventListener("mouseout", () => {
                  spacecraft.style.filter = "";
                });
                spacecraft.addEventListener("click", () => {
                  showScene();
                });

                // После завершения анимации восстанавливаем интерфейс
                setTimeout(() => {
                  returnToShipBtn.remove();
                }, 300);
              });
            }, 1000);
          } else {
            // Для других планет: снова показываем кнопки выбора
            showPlanetChoices();
          }
        }
      );
    });
  });
}
function showScene() {
  // Создаем контейнер для катсцены
  const scene = document.createElement("div");
  scene.id = "scene";
  scene.style.cssText = `
        position: fixed;
        top: -325px;
        left: 0;
        width: 100%;
        height: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;

  // Создаем изображение панели
  const panel = document.createElement("img");
  panel.src = "../images/panel_map.png";
  panel.alt = "Панель управления кораблем";
  panel.style.width = "100%";
  panel.style.maxWidth = "2000px";
  panel.style.top = "780px";
  panel.style.position = "relative";
  panel.style.transition = "opacity 2s";

  // Создаем кнопку Карта
  const mapBtn = document.createElement("button");
  mapBtn.id = "mapButton";
  mapBtn.className = "btn btn-outline-purple";
  mapBtn.style.cssText = `position: fixed;
    width: 25%;
    top: 3%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2001; // Увеличиваем z-index для кнопки
  `;
  mapBtn.textContent = "Карта";

  // Проверяем, существует ли уже контейнер карты

  let mapContainer = document.getElementById("mapContainer");

  if (!mapContainer) {
    // Создаем контейнер для карты (изначально скрыт)
    mapContainer = document.createElement("div");
    mapContainer.id = "mapContainer";
    mapContainer.style.display = "none";

    // Добавляем стили для позиционирования
    mapContainer.style.position = "fixed";
    mapContainer.style.top = "0";
    mapContainer.style.left = "0";
    mapContainer.style.width = "100%";
    mapContainer.style.height = "100%";
    mapContainer.style.justifyContent = "center";
    mapContainer.style.alignItems = "center";
    mapContainer.style.backgroundColor = "rgba(0,0,0,0.7)";
    mapContainer.style.zIndex = "3000";

    document.body.appendChild(mapContainer);
    document.body.appendChild(mapContainer);

    // Обертка для карты
    const mapWrapper = document.createElement("div");
    mapWrapper.className = "map-wrapper";
    mapContainer.appendChild(mapWrapper);

    // Изображение карты
    const map = document.createElement("img");
    map.id = "mapImage";
    map.src = "../images/map.png";
    map.alt = "Карта";
    map.className = "map-image";
    mapWrapper.appendChild(map);

    // Кнопка закрытия карты
    const closeMapBtn = document.createElement("button");
    closeMapBtn.id = "closeMapBtn";
    closeMapBtn.innerHTML = "&times;";
    closeMapBtn.style.zIndex = "3001"; // Увеличиваем z-index
    mapContainer.appendChild(closeMapBtn);

    // Обработчики событий
    closeMapBtn.addEventListener("click", () => {
      mapContainer.style.display = "none";
    });
  }

  // Обработчик для кнопки карты
  mapBtn.addEventListener("click", () => {
    mapContainer.style.display = "flex";

    // Координаты планет (обновляем при каждом открытии)
    const mapImage = document.getElementById("mapImage");
    const mapWrapper = mapImage.parentElement;

    // Удаляем старые кнопки планет
    document.querySelectorAll(".planet-btn").forEach((btn) => btn.remove());

    // Координаты планет в пикселях относительно карты
    const planets = [
      { surname: "Активия", name: "nebula", x: 50, y: 50 }, // Примерные координаты
      { surname: "Фиалка", name: "station", x: 17, y: 22 }, // Нужно подобрать под вашу карту
      { surname: "Зеркало", name: "mirror", x: 38, y: 20 }, // На основе вашего изображения
    ];
    const planetSizes = {
      nebula: { width: 6, height: 14 },
      station: { width: 8, height: 18 },
      mirror: { width: 4, height: 10 },
    };

    // Создаем интерактивные кнопки планет
    planets.forEach((planet) => {
      const planetBtn = document.createElement("div");
      planetBtn.className = "planet-btn";
      planetBtn.dataset.planet = planet.name;
      planetBtn.dataset.title = "Заголовок планеты";
      planetBtn.style.position = "absolute";
      planetBtn.style.left = `${planet.x}%`;

      planetBtn.style.top = `${planet.y}%`;
      planetBtn.style.zIndex = "20"; // Выше карты

      // Добавляем индивидуальные размеры для каждой кнопки
      const size = planetSizes[planet.name];
      planetBtn.style.width = `${size.width}%`;
      planetBtn.style.height = `${size.height}%`;

      mapWrapper.appendChild(planetBtn);

      planetBtn.addEventListener("click", function () {
        showCutsceneForPlanet();
      });
    });
  });

  // Добавляем панель в контейнер
  scene.appendChild(panel);
  scene.appendChild(mapBtn);
  document.body.appendChild(scene);

  // Анимация появления
  setTimeout(() => {
    panel.style.opacity = "1";
  }, 300);

  const spacecraft = document.getElementById("spacecraftImage");
  const leftPanel = document.getElementById("left-panel");
  const rightPanel = document.getElementById("right-panel");
  if (spacecraft) spacecraft.remove();
  if (leftPanel) leftPanel.remove();
  if (rightPanel) rightPanel.remove();
}

function showCutsceneForPlanet() {
  const mapContainer = document.getElementById("mapContainer");
  const scene = document.getElementById("scene");
  if (mapContainer) mapContainer.remove();
  if (scene) scene.remove();
  const cutscene = document.createElement("div");
  cutscene.id = "final_cutscene";
  cutscene.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../images/stars.png');
    pointer-events: none;
  `;

  const panel = document.createElement("img");
  panel.id = "final_brown";
  panel.src = "../images/panel_map.png";
  panel.alt = "Панель управления";
  panel.style.cssText = `
    width: 100%;
    max-width: 2000px;
    position: relative;
    transition: transform 0.1s;
    top: "410px" !important;
  `;

  // Создаем планету с фиолетовым цветом
  const planet = document.createElement("div");
  planet.style.cssText = `
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #5a189a, #9d4edd);
    box-shadow: 0 0 40px rgba(157, 78, 221, 0.8);
    top: 100px;
    right: 30%;
    transition: transform 0.5s;
    z-index: 10;
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
        // Затемнение экрана перед переходом
        document.body.style.transition = "filter 1s ease";
        document.body.style.filter = "brightness(0)";

        // Переход на station.html после затемнения
        setTimeout(() => {
          window.location.href = "station.html";
        }, 1000);
      }, 1000);
    }
  };

  animate();
}
// Сделаем функции доступными глобально
window.collectArtifact = collectArtifact;
window.updateLocation = updateLocation;
