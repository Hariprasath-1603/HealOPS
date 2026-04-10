const DEFAULT_BASE_URL = "http://localhost:8000";

function getBaseUrl() {
  return localStorage.getItem("healops.apiBaseUrl") || DEFAULT_BASE_URL;
}

export function setBaseUrl(url) {
  localStorage.setItem("healops.apiBaseUrl", url);
}

export function getToken() {
  return localStorage.getItem("healops.token") || "";
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem("healops.token");
    return;
  }
  localStorage.setItem("healops.token", token);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (networkError) {
    const error = new Error(`Network error on ${method} ${path}. Check API URL and CORS settings.`);
    error.status = 0;
    error.path = path;
    throw error;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail = typeof payload?.detail === "string" ? payload.detail : "Request failed";
    const message = `${method} ${path} failed (${response.status}): ${detail}`;
    const error = new Error(message);
    error.status = response.status;
    error.path = path;
    throw error;
  }

  return payload;
}

export const api = {
  getBaseUrl,
  setBaseUrl,
  async login(email, password) {
    return request("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password }
    });
  },
  async register({ email, username, password, role = "staff" }) {
    return request("/api/auth/register", {
      method: "POST",
      auth: false,
      body: {
        email,
        username,
        password,
        role,
        is_active: true
      }
    });
  },
  async me() {
    return request("/api/auth/me");
  },
  async getPatients() {
    return request("/api/patients/");
  },
  async createPatient(payload) {
    return request("/api/patients/", { method: "POST", body: payload });
  },
  async updatePatient(id, payload) {
    return request(`/api/patients/${id}`, { method: "PUT", body: payload });
  },
  async deletePatient(id) {
    return request(`/api/patients/${id}`, { method: "DELETE" });
  },
  async getAppointments() {
    return request("/api/appointments/");
  },
  async createAppointment(payload) {
    return request("/api/appointments/", { method: "POST", body: payload });
  },
  async getDoctors() {
    return request("/api/doctors/");
  }
};
