const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const products = [
  {
    _id: "p1",
    name: "HP Pavilion 15",
    category: "Laptop",
    price: 59999,
    rating: 4.6,
    stock: 12,
    image: "hp",
    badge: "Best seller",
    featured: true,
    description: "A dependable performance laptop for study, office, and daily multitasking.",
  },
  {
    _id: "p2",
    name: "iPhone 16",
    category: "Mobile",
    price: 79900,
    rating: 4.8,
    stock: 8,
    image: "iphone",
    badge: "New",
    featured: true,
    description: "A premium phone with a bright display, strong cameras, and fast performance.",
  },
  {
    _id: "p3",
    name: "Dell Inspiron 14",
    category: "Laptop",
    price: 52999,
    rating: 4.4,
    stock: 10,
    image: "dell",
    badge: "Value pick",
    featured: true,
    description: "Compact, practical, and ready for work from anywhere.",
  },
];

const users = [
  {
    _id: "u1",
    name: "ElectroMart Admin",
    email: "admin@electromart.test",
    password: bcrypt.hashSync("admin123", 10),
    role: "Admin",
    status: "Active",
  },
];

const orders = [
  {
    _id: "o1",
    customer: "Sample Customer",
    email: "customer@electromart.test",
    payment: "UPI",
    status: "Packed",
    total: 79900,
    itemCount: 1,
    items: [{ name: "iPhone 16", price: 79900, quantity: 1 }],
    createdAt: new Date().toISOString(),
  },
];

function publicUser(user) {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((item) => item._id === decoded.id);

    if (!user || user.status !== "Active") {
      return res.status(401).json({ message: "Account is not active" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

function registerMemoryApi(app) {
  const router = express.Router();

  router.post("/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: "Name, email, and 6 character password are required" });
    }

    if (users.some((user) => user.email === email)) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = {
      _id: `u${Date.now()}`,
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "Customer",
      status: "Active",
    };

    users.push(user);
    res.status(201).json({ token: createToken(user), user: publicUser(user) });
  });

  router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((item) => item.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user), user: publicUser(user) });
  });

  router.get("/auth/me", protect, (req, res) => {
    res.json({ user: publicUser(req.user) });
  });

  router.get("/products", (req, res) => {
    res.json(products);
  });

  router.post("/products", protect, adminOnly, (req, res) => {
    const product = {
      _id: `p${Date.now()}`,
      ...req.body,
      price: Number(req.body.price),
      rating: Number(req.body.rating || 4.5),
      stock: Number(req.body.stock || 0),
    };
    products.unshift(product);
    res.status(201).json(product);
  });

  router.put("/products/:id", protect, adminOnly, (req, res) => {
    const index = products.findIndex((product) => product._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    products[index] = {
      ...products[index],
      ...req.body,
      price: Number(req.body.price),
      rating: Number(req.body.rating || products[index].rating),
      stock: Number(req.body.stock || 0),
    };
    res.json(products[index]);
  });

  router.delete("/products/:id", protect, adminOnly, (req, res) => {
    const index = products.findIndex((product) => product._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    products.splice(index, 1);
    res.json({ message: "Product deleted" });
  });

  router.get("/orders", protect, adminOnly, (req, res) => {
    res.json(orders);
  });

  router.post("/orders", protect, (req, res) => {
    const order = {
      _id: `o${Date.now()}`,
      status: "Processing",
      createdAt: new Date().toISOString(),
      ...req.body,
      customer: req.body.customer || req.user.name,
      email: req.body.email || req.user.email,
    };
    orders.unshift(order);
    res.status(201).json(order);
  });

  router.patch("/orders/:id/status", protect, adminOnly, (req, res) => {
    const order = orders.find((item) => item._id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    res.json(order);
  });

  router.get("/users", protect, adminOnly, (req, res) => {
    res.json(users.map(publicUser));
  });

  router.patch("/users/:id/status", protect, adminOnly, (req, res) => {
    const user = users.find((item) => item._id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = req.body.status;
    res.json(publicUser(user));
  });

  app.use("/api", router);
}

module.exports = registerMemoryApi;
