export const API_BASE_URL = "http://127.0.0.1:8000";
export const AUTH_TOKEN_KEY = "atlas.accessToken";
export const AUTH_REFRESH_TOKEN_KEY = "atlas.refreshToken";
export const AUTH_USER_KEY = "atlas.user";

function getStorage() {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export function getToken() {
  return getStorage()?.getItem(AUTH_TOKEN_KEY) || "";
}

export function getUser() {
  const value = getStorage()?.getItem(AUTH_USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function clearAuth() {
  const storage = getStorage();
  storage?.removeItem(AUTH_TOKEN_KEY);
  storage?.removeItem(AUTH_REFRESH_TOKEN_KEY);
  storage?.removeItem(AUTH_USER_KEY);
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await readResponse(response);

  if (!response.ok || !data.token) {
    throw new Error(data.error || "Usuario o contraseña incorrectos.");
  }

  const storage = getStorage();
  storage?.setItem(AUTH_TOKEN_KEY, data.token);
  storage?.setItem(AUTH_REFRESH_TOKEN_KEY, data["refresh-token"] || "");
  storage?.setItem(AUTH_USER_KEY, JSON.stringify(data.user || {}));

  return data;
}

export async function logout() {
  const user = getUser();
  const token = getToken();

  try {
    if (user?.id) {
      await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user: user.id }),
      });
    }
  } finally {
    clearAuth();
  }
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
