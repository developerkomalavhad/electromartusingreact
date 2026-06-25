const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    payment: { type: String, default: "UPI" },
    status: {
      type: String,
      enum: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    items: [orderItemSchema],
    itemCount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
