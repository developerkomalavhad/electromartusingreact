const API_BASE = "/api";

export const storage = {
  getToken() {
    return localStorage.getItem("electromart_token");
  },
  setSession(session) {
    localStorage.setItem("electromart_token", session.token);
    localStorage.setItem("electromart_user", JSON.stringify(session.user));
  },
  getUser() {
    const savedUser = localStorage.getItem("electromart_user");
    return savedUser ? JSON.parse(savedUser) : null;
  },
  clearSession() {
    localStorage.removeItem("electromart_token");
    localStorage.removeItem("electromart_user");
  },
};

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = storage.getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  login(credentials) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  register(profile) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  },
  getProducts() {
    return request("/products");
  },
  createProduct(product) {
    return request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },
  updateProduct(productId, product) {
    return request(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },
  deleteProduct(productId) {
    return request(`/products/${productId}`, { method: "DELETE" });
  },
  getOrders() {
    return request("/orders");
  },
  createOrder(order) {
    return request("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });
  },
  updateOrderStatus(orderId, status) {
    return request(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  getUsers() {
    return request("/users");
  },
  updateUserStatus(userId, status) {
    return request(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
