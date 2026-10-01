const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options
    });
  } catch {
    throw new Error("Cannot reach the API. Make sure the backend is running.");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload;
}

export const budgetService = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") query.set(key, value);
    });
    return request(`/entries${query.size ? `?${query}` : ""}`);
  },
  get: (id) => request(`/entries/${id}`),
  create: (data) => request("/entries", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/entries/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/entries/${id}`, { method: "DELETE" })
};
