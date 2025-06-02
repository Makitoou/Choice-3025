import { login, logout, register, refreshToken } from "./api.js";

// Проверка срока действия токена
function jwtDecrypt(token) {
  const [, payload] = token.split(".");
  return JSON.parse(atob(payload));
}

function tokenAlive(exp) {
  return Date.now() < exp * 1000;
}

async function checkToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.accessToken) return false;

  const { exp } = jwtDecrypt(user.accessToken);
  if (tokenAlive(exp)) return true;

  try {
    await refreshToken(user);
    return true;
  } catch (error) {
    logout();
    return false;
  }
}

// Отслеживание бездействия
let inactivityTime = null;
const inactivityLimit = 15 * 60 * 1000; // 15 минут

function handleInactivity() {
  clearTimeout(inactivityTime);
  inactivityTime = setTimeout(() => {
    logout();
    window.location.href = "/html/login.html"; // Создадим эту страницу позже
  }, inactivityLimit);
}

window.onload = handleInactivity;
document.onmousemove = handleInactivity;

export { login, logout, register, checkToken };
