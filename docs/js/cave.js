import { ensureSaveExists, savePhase } from "./save-manager.js";
const imagesData = [
  { id: 1, file: "bar.png", x: 320, y: 60 },
  { id: 2, file: "file.png", x: 200, y: 800 },
  { id: 3, file: "diamonds.png", x: 1300, y: 80 },
  { id: 4, file: "bar.png", x: 1550, y: 70 },
  { id: 5, file: "fuel.png", x: 800, y: -30 },
];
document.addEventListener("DOMContentLoaded", function () {
  ensureSaveExists();
  savePhase("into-cave");
  document.body.style.filter = "brightness(0)";
  document.body.style.transition = "filter 1.5s ease";

  setTimeout(() => {
    document.body.style.filter = "brightness(1)";
  }, 100);

  setTimeout(() => {
    document.body.style.transition = "";
    document.body.style.filter = "";
  }, 1600);

  createSurfaceImages();
  createInventoryUI();
  document
    .querySelector("button.btn-outline-purple:nth-of-type(1)")
    ?.addEventListener("click", async () => {
      const panel = document.getElementById("inventoryPanel");
      panel.classList.remove("hidden");
      document.getElementById("inventoryBadge")?.classList.add("d-none");

      const saveId = getCurrentSaveId();
      const user = JSON.parse(localStorage.getItem("user"));
      const container = document.getElementById("inventoryItems");
      container.innerHTML = "Загрузка...";

      try {
        const res = await fetch(
          `http://localhost:3000/api/inventory/save/${saveId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user.accessToken,
            },
          }
        );
        const items = await res.json();
        container.innerHTML = "";

        const stacked = {};
        items.forEach((item) => {
          const imageInfo = imagesData.find((img) => img.id === item.itemId);
          const fileKey = imageInfo ? imageInfo.file : "default.png";

          if (!stacked[fileKey]) {
            stacked[fileKey] = {
              quantity: item.quantity,
              file: fileKey,
            };
          } else {
            stacked[fileKey].quantity += item.quantity;
          }
        });

        Object.values(stacked).forEach((item) => {
          const itemBox = document.createElement("div");
          itemBox.className = "inventory-item";
          itemBox.innerHTML = `
    <img src="../images/${
      item.file
    }" alt="item" width="48" title="${getItemName(
            item
          )}" style="cursor: pointer;">
    <p class="m-0">x${item.quantity}</p>
  `;
          container.appendChild(itemBox);
        });
      } catch (err) {
        container.innerHTML = "Ошибка загрузки инвентаря";
      }
    });
  updateShipStatusUI();
});
function getItemName(item) {
  // если ты стакуешь по file
  const nameMap = {
    "bar.png": "Металлические обломки",
    "file.png": "Записки отца",
    "diamonds.png": "Алмаз",
    "fuel.png": "Канистра с топливом",
  };

  return nameMap[item.file] || "Неизвестный предмет";
}
const imagesOnSurface = [];
function createInventoryUI() {
  const panel = document.createElement("div");
  panel.id = "inventoryPanel";
  panel.className = "inventory hidden";

  panel.innerHTML = `
    <div class="inventory-header">
      <h4 class="text-purple neon-title">Инвентарь</h4>
      <button id="closeInventory" class="btn btn-sm btn-outline-purple">Закрыть</button>
    </div>
    <div id="inventoryItems" class="inventory-items mt-3"></div>
  `;

  document.body.appendChild(panel);

  document.getElementById("closeInventory").addEventListener("click", () => {
    panel.classList.add("hidden");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") panel.classList.add("hidden");
  });
}

async function getCollectedArtifactIds() {
  const saveId = getCurrentSaveId();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!saveId || !user?.accessToken) return [];

  try {
    const response = await fetch(
      `http://localhost:3000/api/inventory/save/${saveId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user.accessToken,
        },
      }
    );

    if (!response.ok) throw new Error("Ошибка загрузки инвентаря");

    const items = await response.json();
    return items.map((item) => item.itemId); // 🎯 массив ID собранных артефактов
  } catch (err) {
    console.error("Ошибка при получении инвентаря:", err);
    return [];
  }
}

async function createSurfaceImages() {
  const collectedIds = await getCollectedArtifactIds();

  imagesData.forEach((imgData) => {
    if (collectedIds.includes(imgData.id)) return; // ❌ уже собран — пропускаем

    const imageElem = document.createElement("img");
    imageElem.src = `../images/${imgData.file}`;
    imageElem.className = "artefact";
    imageElem.style.position = "fixed";
    imageElem.style.left = `${imgData.x}px`;
    imageElem.style.bottom = `${imgData.y}px`;
    imageElem.style.opacity = "0";
    imageElem.style.zIndex = "1000";
    document.body.appendChild(imageElem);

    imageElem.onload = () => {
      setTimeout(() => (imageElem.style.opacity = "1"), 100);
    };

    imageElem.addEventListener("click", () => {
      document.getElementById("inventoryBadge")?.classList.remove("d-none");
      const artifactId = imgData.id;
      if (window.collectArtifact) {
        window.collectArtifact(artifactId);
      }
      imageElem.style.opacity = "0";
      setTimeout(() => imageElem.remove(), 1000);
    });

    imagesOnSurface.push(imageElem);
  });
}
function getCurrentSaveId() {
  return localStorage.getItem("currentSaveId");
}

window.collectArtifact = async function (artifactId) {
  const saveId = getCurrentSaveId();
  if (!saveId) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.accessToken) {
    console.error("Нет accessToken. Пользователь не авторизован.");
    return;
  }

  const imageData = imagesData.find((img) => img.id === artifactId);
  const file = imageData?.file;

  if (!file) {
    console.error("Не удалось определить file по artifactId", artifactId);
    return;
  }

  try {
    await fetch("http://localhost:3000/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": user.accessToken,
      },
      body: JSON.stringify({
        SaveId: saveId,
        itemId: artifactId,
        quantity: 1,
        file,
        metadata: { collectedAt: new Date().toISOString() },
      }),
    });
    console.log(`Артефакт ${artifactId} добавлен в инвентарь.`);
  } catch (err) {
    console.error("Ошибка при сохранении артефакта:", err);
  }
};

function returnToPlanetSurface() {
  document.body.style.transition = "filter 1s ease";
  document.body.style.filter = "brightness(0)";

  setTimeout(() => {
    window.location.href = "play.html?state=surface_zoomed";
  }, 1000);
}
window.returnToPlanetSurface = returnToPlanetSurface;
async function updateShipStatusUI() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.accessToken) return;

  try {
    const res = await fetch("http://localhost:3000/api/ship-status", {
      headers: {
        "x-access-token": user.accessToken,
      },
    });
    const data = await res.json();

    const shieldsBar = document.getElementById("shields-bar");
    const fuelBar = document.getElementById("fuel-bar");

    shieldsBar.style.width = `${data.shields}%`;
    shieldsBar.textContent = `${data.shields}%`;

    fuelBar.style.width = `${data.fuel}%`;
    fuelBar.textContent = `${data.fuel}%`;
  } catch (err) {
    console.error("Ошибка загрузки статуса корабля", err);
  }
}
