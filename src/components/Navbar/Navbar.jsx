import "./Navbar.css";
import { NavLink, Link } from "react-router-dom";

function Navbar({ cartCount = 0, user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        ElectroMart
      </Link>

      <ul className="nav-links">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
        <li>
          <NavLink to="/admin">Admin</NavLink>
        </li>
        <li>
          <NavLink to="/cart">Cart {cartCount > 0 && <span>{cartCount}</span>}</NavLink>
        </li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome">Hi, {user.name}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <NavLink className="login-link" to="/login">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
