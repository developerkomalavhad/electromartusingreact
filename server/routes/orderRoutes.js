const express = require("express");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, async (req, res, next) => {
  try {
    const order = await Order.create({
      ...req.body,
      user: req.user._id,
      customer: req.body.customer || req.user.name,
      email: req.body.email || req.user.email,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", protect, adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
