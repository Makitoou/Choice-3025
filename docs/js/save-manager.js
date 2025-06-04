import axios from "https://cdn.jsdelivr.net/npm/axios/+esm";
axios.defaults.baseURL = "http://localhost:3000/api";

export function getAccessToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.accessToken || null;
}

export async function ensureSaveExists() {
  const token = getAccessToken();
  if (!token) {
    console.warn("❌ Нет токена, пользователь не авторизован");
    return null;
  }

  const currentSaveId = localStorage.getItem("currentSaveId");

  if (currentSaveId) {
    try {
      const check = await axios.get(`/save/${currentSaveId}`, {
        headers: { "x-access-token": token },
      });
      console.log("✅ Используем сохранение из localStorage:", currentSaveId);
      return currentSaveId;
    } catch (err) {
      console.warn("⚠️ Сохранение из localStorage не существует, создаём новое");
      localStorage.removeItem("currentSaveId"); // очищаем невалидное
    }
  }

  // Пытаемся получить последнее
  try {
    const latest = await axios.get("/save/latest", {
      headers: { "x-access-token": token },
    });
    localStorage.setItem("currentSaveId", latest.data.id);
    console.log("✅ Сохранение загружено:", latest.data.id);
    return latest.data.id;
  } catch (err) {
    if (err.response?.status === 404) {
      const newSave = await axios.post(
        "/save/init",
        {},
        { headers: { "x-access-token": token } }
      );
      localStorage.setItem("currentSaveId", newSave.data.id);
      console.log("📦 Новое сохранение создано:", newSave.data.id);
      return newSave.data.id;
    } else {
      console.error("❌ Ошибка получения сохранения:", err);
      return null;
    }
  }
}
export async function savePhase(phase) {
  const saveId = localStorage.getItem("currentSaveId");
  const token = getAccessToken();
  if (!saveId || !token) {
    console.warn("⚠️ Нет токена или сохранения");
    return;
  }

  try {
    await axios.put(
      `/save/${saveId}`,
      { gameState: { phase } },
      { headers: { "x-access-token": token } }
    );
    console.log(`✅ Фаза "${phase}" сохранена`);
  } catch (err) {
    console.warn(`❌ Не удалось сохранить фазу "${phase}"`, err.message);
  }
}
