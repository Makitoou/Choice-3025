// js/auth-protect.js

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.accessToken) {
    config.headers["x-access-token"] = user.accessToken;
  }
  return config;
});

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// === Toast ===
function showToast(message, duration = 2500) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #8a2be2;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    font-family: 'Space Mono', monospace;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.4s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = 1), 50);
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// === Auth ===
async function login(user) {
  const res = await api.post("/api/login", user);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
}

async function register(user) {
  const res = await api.post("/api/register", user);
  return res.data.result;
}

function logout() {
  localStorage.removeItem("user");
}

async function refreshToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await api.post("/api/refreshToken", { username: user.username });
  localStorage.setItem("user", JSON.stringify(res.data.result));
}

// === Проверка токена и живости пользователя ===
async function checkToken() {
  const userData = localStorage.getItem("user");
  if (!userData) return false;

  const user = JSON.parse(userData);
  if (!user.accessToken) return false;

  const payload = parseJwt(user.accessToken);
  if (!payload || Date.now() >= payload.exp * 1000) {
    try {
      await refreshToken();
    } catch {
      logout();
      return false;
    }
  }

  try {
    const res = await api.get("/api/userBoard");
    return res.status === 200;
  } catch {
    logout();
    return false;
  }
}

// === Защита страниц ===
const protectedPages = ["settings.html", "play.html", "archive.html"];

async function protectPage() {
  const currentPage = window.location.pathname.split("/").pop();
  if (protectedPages.includes(currentPage)) {
    const valid = await checkToken();
    if (!valid) {
      showToast("⛔ Доступ запрещён. Выполните вход.");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    }
  }
}

// === Автовыход по бездействию ===
let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    logout();
    window.location.href = "login.html";
  }, 15 * 60 * 1000);
}

function initActivityTracker() {
  ["load", "mousemove", "keypress", "scroll", "click"].forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
  });
  resetInactivityTimer();
}

// === Автозапуск защиты на нужных страницах ===
document.addEventListener("DOMContentLoaded", () => {
  protectPage();
  initActivityTracker();
});

// === Экспорт в window для форм регистрации и входа ===
window.login = login;
window.logout = logout;
window.register = register;
window.checkToken = checkToken;
window.showToast = showToast;
