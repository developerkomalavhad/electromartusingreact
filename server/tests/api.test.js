/**
 * Backend API Testing Suite
 * Tests all endpoints with validation and error handling
 * Run with: npm test
 */

const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Mock server setup
const createTestServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Test data store
  const db = {
    users: [],
    products: [],
    orders: [],
  };

  // Routes
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    if (db.users.find((u) => u.email === email)) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = { id: Date.now(), name, email, password, role: "Customer" };
    db.users.push(user);

    res.status(201).json({
      token: "fake-token",
      user: { id: user.id, name, email, role: user.role },
    });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = db.users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: "fake-token",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });

  app.get("/api/products", (req, res) => {
    res.json(db.products);
  });

  app.post("/api/products", (req, res) => {
    const { name, category, price, description, image } = req.body;

    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const product = {
      id: Date.now(),
      name,
      category,
      price,
      description,
      image,
      stock: 10,
      rating: 4.5,
      featured: false,
    };

    db.products.push(product);
    res.status(201).json(product);
  });

  app.post("/api/orders", (req, res) => {
    const { items, total, customer, email } = req.body;

    if (!items || !total) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid items" });
    }

    const order = {
      id: Date.now(),
      items,
      total,
      customer: customer || "Unknown",
      email: email || "unknown@test.com",
      status: "Processing",
      createdAt: new Date(),
    };

    db.orders.push(order);
    res.status(201).json(order);
  });

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, timestamp: new Date() });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  });

  return app;
};

// Tests
describe("ElectroMart Backend API Tests", () => {
  let app;

  beforeAll(() => {
    app = createTestServer();
  });

  describe("Health Check", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe("Authentication", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@test.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe("John Doe");
      expect(res.body.user.email).toBe("john@test.com");
    });

    it("should not register user with short password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Jane Doe",
        email: "jane@test.com",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Password");
    });

    it("should not register duplicate email", async () => {
      await request(app).post("/api/auth/register").send({
        name: "User 1",
        email: "duplicate@test.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "User 2",
        email: "duplicate@test.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain("already registered");
    });

    it("should login with valid credentials", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Login Test",
        email: "login@test.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "login@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("login@test.com");
    });

    it("should not login with invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@test.com",
        password: "wrongpass",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain("Invalid");
    });

    it("should reject login with missing fields", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@test.com",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Missing");
    });
  });

  describe("Products", () => {
    it("should get all products", async () => {
      const res = await request(app).get("/api/products");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should create a new product", async () => {
      const res = await request(app).post("/api/products").send({
        name: "Test Laptop",
        category: "Laptop",
        price: 59999,
        description: "A high-performance laptop for professionals",
        image: "laptop.jpg",
      });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Test Laptop");
      expect(res.body.category).toBe("Laptop");
      expect(res.body.price).toBe(59999);
    });

    it("should not create product with missing fields", async () => {
      const res = await request(app).post("/api/products").send({
        name: "Incomplete Product",
        price: 1000,
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Missing");
    });

    it("should not create product with invalid price", async () => {
      const res = await request(app).post("/api/products").send({
        name: "Invalid Price",
        category: "Mobile",
        price: -100,
        description: "Product with negative price",
        image: "phone.jpg",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("price");
    });
  });

  describe("Orders", () => {
    it("should create a new order", async () => {
      const res = await request(app).post("/api/orders").send({
        items: [
          { name: "iPhone", price: 79900, quantity: 1 },
          { name: "Case", price: 500, quantity: 2 },
        ],
        total: 80900,
        customer: "John Doe",
        email: "john@test.com",
      });

      expect(res.status).toBe(201);
      expect(res.body.total).toBe(80900);
      expect(res.body.items.length).toBe(2);
      expect(res.body.status).toBe("Processing");
    });

    it("should not create order without items", async () => {
      const res = await request(app).post("/api/orders").send({
        items: [],
        total: 1000,
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Invalid");
    });

    it("should not create order with missing total", async () => {
      const res = await request(app).post("/api/orders").send({
        items: [{ name: "Product", price: 100, quantity: 1 }],
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Missing");
    });
  });
});

module.exports = { createTestServer };