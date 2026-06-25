import { Link } from "react-router-dom";
import { getProductId, resolveProductImage } from "../../utils/productImages";
import "./Cart.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function Cart({ cartItems, updateQuantity }) {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const delivery = subtotal > 0 && subtotal < 50000 ? 499 : 0;
  const total = subtotal + delivery;

  if (!cartItems.length) {
    return (
      <main className="page">
        <div className="empty-state">
          <h1>Your cart is empty</h1>
          <p>Add a laptop or mobile to begin your order.</p>
          <Link className="button" to="/products">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page cart-page">
      <section>
        <h1 className="section-title">Shopping Cart</h1>
        <p className="section-subtitle">
          Review items, update quantities, and continue to checkout.
        </p>

        <div className="cart-list">
          {cartItems.map((item) => (
            <article className="cart-item" key={getProductId(item)}>
              <img src={resolveProductImage(item.image)} alt={item.name} />
              <div>
                <p>{item.category}</p>
                <h2>{item.name}</h2>
                <strong>{formatPrice(item.price)}</strong>
              </div>
              <div className="quantity-control">
                <button
                  aria-label={`Decrease ${item.name} quantity`}
                  onClick={() => updateQuantity(getProductId(item), item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  aria-label={`Increase ${item.name} quantity`}
                  onClick={() => updateQuantity(getProductId(item), item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="order-summary">
        <h2>Order Summary</h2>
        <div>
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div>
          <span>Delivery</span>
          <strong>{delivery ? formatPrice(delivery) : "Free"}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <Link className="button secondary" to="/checkout">
          Checkout
        </Link>
      </aside>
    </main>
  );
}

export default Cart;
