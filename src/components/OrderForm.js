/**
 * OrderForm Component
 * Allows users to place orders
 */

import React, { useState } from "react";
import { orderAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const OrderForm = ({ items, onOrderSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customer: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    payment: "UPI",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Calculate total
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderData = {
        ...formData,
        items,
        total,
        itemCount: items.length,
      };

      const order = await orderAPI.create(orderData);
      onOrderSuccess && onOrderSuccess(order);
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-container">
      <h2>Place Order</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customer">Full Name</label>
          <input
            id="customer"
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your delivery address"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="payment">Payment Method</label>
          <select
            id="payment"
            name="payment"
            value={formData.payment}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="NetBanking">Net Banking</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Total Items: {items.length}</p>
          <p className="total">
            Total Price: ₹
            {items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
          </p>
        </div>

        <button type="submit" disabled={loading || items.length === 0}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
