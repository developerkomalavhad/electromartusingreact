import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/">ElectroMart</Link>
          <p>
            A clean electronics storefront for laptops, mobiles, quick cart
            actions, and simple checkout.
          </p>
          <div className="footer-badges">
            <span>Secure checkout</span>
            <span>Fast delivery</span>
          </div>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          <Link to="/products">All Products</Link>
          <Link to="/products">Laptops</Link>
          <Link to="/products">Mobiles</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-column">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/checkout">Checkout</Link>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <Link to="/contact">Contact</Link>
          <span>support@electromart.test</span>
          <span>+91 93738 99248</span>
          <span>10:00 AM - 7:00 PM</span>
        </div>

        <div className="footer-column">
          <h3>Admin</h3>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/users">Users</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 ElectroMart. Demo store project.</span>
        <div>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Shipping</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
