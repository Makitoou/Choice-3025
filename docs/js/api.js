const API_URL = "http://localhost:3000";

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    config.headers["x-access-token"] = user.accessToken;
  }
  return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Обработка HTTP ошибок
      console.error("Ошибка API:", {
        status: error.response.status,
        message: error.response.data?.message || "Unknown error",
      });

      throw new Error(
        error.response.data?.message || `HTTP error ${error.response.status}`
      );
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error("Сервер не ответил:", error.request);
      throw new Error(
        "Сервер не отвечает. Проверьте подключение и CORS-настройки."
      );
    } else {
      // Ошибка настройки запроса
      console.error("Ошибка запроса:", error.message);
      throw error;
    }
  }
);

// Методы API
async function login(user) {
  const data = await api.post("/api/login", {
    username: user.username,
    password: user.password,
  });

  if (data.accessToken) {
    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
}

async function logout() {
  localStorage.removeItem("user");
}

async function register(user) {
  return api.post("/api/register", {
    username: user.username,
    password: user.password,
    email: user.email,
  });
}

async function refreshToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("User not found");

  const data = await api.post("/api/refreshToken", {
    refreshToken: user.refreshToken, // Добавьте refreshToken на сервере
  });

  if (data.accessToken) {
    localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
  }
  return data;
}

// Добавьте методы для работы с настройками
async function getSettings() {
  return api.get("/api/settings");
}

async function updateSettings(settings) {
  return api.put("/api/settings", settings);
}

export { login, logout, register, refreshToken, getSettings, updateSettings };

export const getLatestSave = async () => {
  const token = getUserToken();
  const response = await axios.get(`${API_BASE}/save/latest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
