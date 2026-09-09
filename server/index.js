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
      database: mode === "mongodb" ? mongoose.connection.readyState === 1 : false,
      message: mode === "mongodb" ? "Connected to MongoDB" : "Using in-memory API (perfect for GitHub Codespaces!)"
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || "Server error",
    });
  });

  app.listen(PORT, () => {
    console.log(`\n✨ API running on http://localhost:${PORT} (${mode} mode)`);
    if (mode === "memory") {
      console.log("💡 Using in-memory API - perfect for GitHub Codespaces!");
      console.log("📝 Demo credentials:");
      console.log("   Email: admin@electromart.test");
      console.log("   Password: admin123");
    }
    console.log(`\n🚀 Frontend will connect to http://localhost:${PORT}/api\n`);
  });
}

// Try MongoDB, fallback to memory mode
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Quick timeout for faster fallback
  })
  .then(async () => {
    console.log("✅ MongoDB connected successfully");
    try {
      await seedDatabase();
      console.log("✅ Database seeded");
    } catch (seedError) {
      console.warn("⚠️  Seed error (non-critical):", seedError.message);
    }
    registerMongoApi();
    startServer("mongodb");
  })
  .catch((error) => {
    console.warn("\n⚠️  MongoDB connection failed:", error.message);
    console.log("📡 Falling back to in-memory API mode...");
    console.log("💡 This is perfect for development and GitHub Codespaces!\n");
    registerMemoryApi(app);
    startServer("memory");
  });
