const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Laptop", "Mobile", "Accessory"], required: true },
    price: { type: Number, required: true, min: 1 },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    stock: { type: Number, default: 10, min: 0 },
    image: { type: String, required: true },
    badge: { type: String, default: "New" },
    description: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
