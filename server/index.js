const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const seedDatabase = require("./seed");
const registerMemoryApi = require("./memoryApi");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/electromart";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

function registerMongoApi() {
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
}

function startServer(mode) {
  app.get("/api/health", (req, res) => {
    res.json({
      ok: true,
      mode,
      database: mongoose.connection.readyState === 1,
    });
  });

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT} (${mode})`);
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedDatabase();
    registerMongoApi();
    startServer("mongodb");
  })
  .catch((error) => {
    console.warn("MongoDB connection failed:", error.message);
    console.warn("Starting API in memory mode for local testing.");
    registerMemoryApi(app);
    startServer("memory");
  });
