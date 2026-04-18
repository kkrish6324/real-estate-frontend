const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000/api");

// ─── Token storage (memory > localStorage for access tokens) ─────────────────
// Access tokens are kept in memory — not persisted to localStorage
// Refresh tokens are in HTTP-only cookies (set by backend, not accessible to JS)
let adminAccessToken: string | null = null;
let userAccessToken: string | null = null;

export const tokenStore = {
  setAdmin: (t: string) => { adminAccessToken = t; },
  setUser: (t: string) => { userAccessToken = t; },
  clearAdmin: () => { adminAccessToken = null; },
  clearUser: () => { userAccessToken = null; },
  getAdmin: () => adminAccessToken,
  getUser: () => userAccessToken,
};

// ─── Refresh helpers ──────────────────────────────────────────────────────────
async function refreshAdminToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    adminAccessToken = data.token;
    return data.token;
  } catch { return null; }
}

async function refreshUserToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/users/refresh`, { method: "POST", credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    userAccessToken = data.token;
    return data.token;
  } catch { return null; }
}

// ─── Core request with auto-retry on 401 ─────────────────────────────────────
async function request(
  path: string,
  options: RequestInit = {},
  role: "admin" | "user" | "none" = "none",
  retry = true
): Promise<unknown> {
  // No backend configured — fail silently so fallback data is used
  if (!BASE_URL) throw new Error("No backend configured");

  const token = role === "admin" ? adminAccessToken : role === "user" ? userAccessToken : null;
  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...((options.headers as Record<string, string>) || {}) },
    credentials: "include", // send cookies (refresh token)
  });

  // Auto-refresh on 401 (expired access token)
  if (res.status === 401 && retry) {
    const newToken = role === "admin" ? await refreshAdminToken() : role === "user" ? await refreshUserToken() : null;
    if (newToken) return request(path, options, role, false);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Auth (Admin) ─────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const data = await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }) as { token: string; admin: object };
    adminAccessToken = data.token;
    return data;
  },
  me: () => request("/auth/me", {}, "admin"),
  logout: async () => {
    await fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
    adminAccessToken = null;
  },
  setup: (data: object) => request("/auth/setup", { method: "POST", body: JSON.stringify(data) }),
  setupStatus: () => request("/auth/setup-status"),
  register: (data: object) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }, "admin"),
  changePassword: (data: object) => request("/auth/change-password", { method: "PUT", body: JSON.stringify(data) }, "admin"),
};

// ─── User Auth ────────────────────────────────────────────────────────────────
export const userAuthApi = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await request("/users/register", { method: "POST", body: JSON.stringify(data) }) as { token: string; user: object };
    userAccessToken = res.token;
    return res;
  },
  login: async (email: string, password: string) => {
    const res = await request("/users/login", { method: "POST", body: JSON.stringify({ email, password }) }) as { token: string; user: object };
    userAccessToken = res.token;
    return res;
  },
  logout: async () => {
    await fetch(`${BASE_URL}/users/logout`, { method: "POST", credentials: "include" });
    userAccessToken = null;
  },
  me: () => request("/users/me", {}, "user"),
  updateProfile: (data: { name: string; phone?: string }) =>
    request("/users/me", { method: "PUT", body: JSON.stringify(data) }, "user"),
  toggleSaved: (propertyId: string) =>
    request(`/users/saved/${propertyId}`, { method: "POST" }, "user"),
};

// ─── Properties ───────────────────────────────────────────────────────────────
export const propertiesApi = {
  getAll: (params?: Record<string, string>) => {
    const q = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/properties${q}`);
  },
  getOne: (id: string) => request(`/properties/${id}`),
  create: (data: FormData) => request("/properties", { method: "POST", body: data }, "admin"),
  update: (id: string, data: FormData) => request(`/properties/${id}`, { method: "PUT", body: data }, "admin"),
  delete: (id: string) => request(`/properties/${id}`, { method: "DELETE" }, "admin"),
};

// ─── Agents ───────────────────────────────────────────────────────────────────
export const agentsApi = {
  getAll: () => request("/agents"),
  getAllAdmin: () => request("/agents/all", {}, "admin"),
  create: (data: FormData) => request("/agents", { method: "POST", body: data }, "admin"),
  update: (id: string, data: FormData) => request(`/agents/${id}`, { method: "PUT", body: data }, "admin"),
  delete: (id: string) => request(`/agents/${id}`, { method: "DELETE" }, "admin"),
};

// ─── Blogs ────────────────────────────────────────────────────────────────────
export const blogsApi = {
  getAll: () => request("/blogs"),
  getAllAdmin: () => request("/blogs/all", {}, "admin"),
  getOne: (id: string) => request(`/blogs/${id}`),
  create: (data: FormData) => request("/blogs", { method: "POST", body: data }, "admin"),
  update: (id: string, data: FormData) => request(`/blogs/${id}`, { method: "PUT", body: data }, "admin"),
  delete: (id: string) => request(`/blogs/${id}`, { method: "DELETE" }, "admin"),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialsApi = {
  getAll: () => request("/testimonials"),
  getAllAdmin: () => request("/testimonials/all", {}, "admin"),
  create: (data: FormData) => request("/testimonials", { method: "POST", body: data }, "admin"),
  update: (id: string, data: FormData) => request(`/testimonials/${id}`, { method: "PUT", body: data }, "admin"),
  delete: (id: string) => request(`/testimonials/${id}`, { method: "DELETE" }, "admin"),
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const statsApi = {
  getAll: () => request("/stats"),
  create: (data: object) => request("/stats", { method: "POST", body: JSON.stringify(data) }, "admin"),
  update: (id: string, data: object) => request(`/stats/${id}`, { method: "PUT", body: JSON.stringify(data) }, "admin"),
  delete: (id: string) => request(`/stats/${id}`, { method: "DELETE" }, "admin"),
};

// ─── Hero Slides ──────────────────────────────────────────────────────────────
export const heroSlidesApi = {
  getAll: () => request("/hero-slides"),
  getAllAdmin: () => request("/hero-slides/all", {}, "admin"),
  create: (data: FormData) => request("/hero-slides", { method: "POST", body: data }, "admin"),
  update: (id: string, data: FormData) => request(`/hero-slides/${id}`, { method: "PUT", body: data }, "admin"),
  delete: (id: string) => request(`/hero-slides/${id}`, { method: "DELETE" }, "admin"),
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => request("/settings"),
  update: (data: object) => request("/settings", { method: "PUT", body: JSON.stringify(data) }, "admin"),
};

// ─── Inquiries ────────────────────────────────────────────────────────────────
export const inquiriesApi = {
  submit: (data: object) => request("/inquiries", { method: "POST", body: JSON.stringify(data) }),
  getAll: () => request("/inquiries", {}, "admin"),
  update: (id: string, data: object) => request(`/inquiries/${id}`, { method: "PUT", body: JSON.stringify(data) }, "admin"),
  delete: (id: string) => request(`/inquiries/${id}`, { method: "DELETE" }, "admin"),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => request("/categories"),
  create: (data: object) => request("/categories", { method: "POST", body: JSON.stringify(data) }, "admin"),
  update: (id: string, data: object) => request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }, "admin"),
  delete: (id: string) => request(`/categories/${id}`, { method: "DELETE" }, "admin"),
};
