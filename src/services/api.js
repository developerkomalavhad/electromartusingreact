/**
 * React API Service
 * Handles all backend API calls with error handling and token management
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Store token in localStorage
const getToken = () => localStorage.getItem("token");
const setToken = (token) => localStorage.setItem("token", token);
const removeToken = () => localStorage.removeItem("token");

// Default headers
const getHeaders = (isFormData = false) => {
  const headers = {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// API request wrapper
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: getHeaders(options.isFormData),
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ============ AUTHENTICATION ============

export const authAPI = {
  register: (name, email, password) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }).then((data) => {
      setToken(data.token);
      return data.user;
    }),

  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((data) => {
      setToken(data.token);
      return data.user;
    }),

  logout: () => {
    removeToken();
  },

  getCurrentUser: () =>
    apiCall("/auth/me", { method: "GET" }).then((data) => data.user),
};

// ============ PRODUCTS ============

export const productAPI = {
  getAll: () =>
    apiCall("/products", { method: "GET" }),

  getById: (id) =>
    apiCall(`/products/${id}`, { method: "GET" }),

  create: (productData) =>
    apiCall("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    apiCall(`/products/${id}`, { method: "DELETE" }),

  search: (query) =>
    apiCall(`/products?search=${encodeURIComponent(query)}`, {
      method: "GET",
    }),

  filterByCategory: (category) =>
    apiCall(`/products?category=${encodeURIComponent(category)}`, {
      method: "GET",
    }),
};

// ============ ORDERS ============

export const orderAPI = {
  getAll: () =>
    apiCall("/orders", { method: "GET" }),

  getById: (id) =>
    apiCall(`/orders/${id}`, { method: "GET" }),

  create: (orderData) =>
    apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  updateStatus: (id, status) =>
    apiCall(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  cancel: (id) =>
    apiCall(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Cancelled" }),
    }),
};

// ============ USERS ============

export const userAPI = {
  getAll: () =>
    apiCall("/users", { method: "GET" }),

  updateStatus: (id, status) =>
    apiCall(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  blockUser: (id) =>
    apiCall(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Blocked" }),
    }),

  unblockUser: (id) =>
    apiCall(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Active" }),
    }),
};

// ============ HEALTH CHECK ============

export const healthAPI = {
  check: () =>
    fetch(`${API_BASE_URL}/health`, { method: "GET" })
      .then((res) => res.json())
      .catch((err) => {
        console.error("Health check failed:", err);
        return { ok: false };
      }),
};

export default {
  authAPI,
  productAPI,
  orderAPI,
  userAPI,
  healthAPI,
};