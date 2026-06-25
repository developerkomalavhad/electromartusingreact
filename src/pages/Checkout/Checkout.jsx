import { useState } from "react";
import { Link } from "react-router-dom";
import "./Checkout.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function Checkout({ cartItems, user, onOrderPlaced }) {
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    payment: "UPI",
  });

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const delivery = subtotal > 0 && subtotal < 50000 ? 499 : 0;
  const total = subtotal + delivery;

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onOrderPlaced({
      customer: form.name,
      email: form.email,
      phone: form.phone,
      total,
      items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      payment: form.payment,
      address: form.address,
    });
    setPlaced(true);
  };

  if (placed) {
    return (
      <main className="page">
        <div className="empty-state">
          <h1>Order placed</h1>
          <p>Thanks, {form.name}. Your demo order has been confirmed.</p>
          <Link className="button" to="/products">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page checkout-page">
      <form className="form-panel checkout-form" onSubmit={handleSubmit}>
        <div>
          <h1>Checkout</h1>
          <p>Enter your delivery details to place the order.</p>
        </div>

        <label>
          Full name
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>
        <label>
          Phone
          <input
            required
            value={form.phone}
            onChange={(event) =>
              setForm({ ...form, phone: event.target.value })
            }
          />
        </label>
        <label>
          Address
          <textarea
            required
            value={form.address}
            onChange={(event) =>
              setForm({ ...form, address: event.target.value })
            }
          />
        </label>
        <label>
          Payment method
          <select
            value={form.payment}
            onChange={(event) =>
              setForm({ ...form, payment: event.target.value })
            }
          >
            <option>UPI</option>
            <option>Card</option>
            <option>Cash on Delivery</option>
          </select>
        </label>

        <button className="button secondary" type="submit">
          Place Order
        </button>
      </form>

      <aside className="checkout-summary">
        <h2>Your Order</h2>
        {cartItems.map((item) => (
          <div key={item.id}>
            <span>
              {item.name} x {item.quantity}
            </span>
            <strong>{formatPrice(item.price * item.quantity)}</strong>
          </div>
        ))}
        <div>
          <span>Delivery</span>
          <strong>{delivery ? formatPrice(delivery) : "Free"}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </aside>
    </main>
  );
}

export default Checkout;
