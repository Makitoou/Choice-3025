const API_URL = "http://localhost:3000"; // Адрес вашего бэкенда

// Функция для отправки запросов
async function request(method, endpoint, data = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Добавляем токен, если он есть
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    headers["x-access-token"] = user.accessToken;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка запроса:", error.message);
    throw error;
  }
}

// Методы для авторизации
async function login(user) {
  const data = await request("POST", "/login", {
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
  return await request("POST", "/register", {
    username: user.username,
    password: user.password,
    email: user.email,
  });
}

async function refreshToken(user) {
  const data = await request("POST", "/refreshToken", {
    username: user.username,
  });
  if (data.accessToken) {
    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
}

export { login, logout, register, refreshToken, request };
