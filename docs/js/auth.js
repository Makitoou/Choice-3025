import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  refreshToken,
} from "./api.js";

// Декодирование JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

// Проверка токена
async function checkToken() {
  const userData = localStorage.getItem("user");
  if (!userData) return false;

  const user = JSON.parse(userData);
  if (!user.accessToken) return false;

  const payload = parseJwt(user.accessToken);
  if (!payload) return false;

  // Проверяем срок действия
  if (Date.now() >= payload.exp * 1000) {
    try {
      await refreshToken();
      return true;
    } catch (error) {
      console.error("Ошибка обновления токена:", error);
      logout();
      return false;
    }
  }

  return true;
}

// Таймер бездействия
let inactivityTimer;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    logout();
    window.location.href = "/html/login.html";
  }, 15 * 60 * 1000); // 15 минут
}

// Инициализация отслеживания активности
function initActivityTracker() {
  window.addEventListener("load", resetInactivityTimer);
  window.addEventListener("mousemove", resetInactivityTimer);
  window.addEventListener("keypress", resetInactivityTimer);
  window.addEventListener("scroll", resetInactivityTimer);
  window.addEventListener("click", resetInactivityTimer);
}

// Обёртки для глобального доступа в HTML
async function login(user) {
  return await apiLogin(user);
}

async function logout() {
  return await apiLogout();
}

async function register(user) {
  return await apiRegister(user);
}

// Экспорт для HTML-страниц
window.login = login;
window.logout = logout;
window.register = register;
window.checkToken = checkToken;
window.initActivityTracker = initActivityTracker;

// Экспорт для модульного кода
export { login, logout, register, checkToken, initActivityTracker };
