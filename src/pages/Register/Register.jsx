import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Register.css";

function Register({ user, onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onRegister(form);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <form className="form-panel" onSubmit={handleSubmit}>
        <div>
          <h1>Create Account</h1>
          <p>Save your details and start building your cart.</p>
        </div>

        <label>
          Full name
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>

        <label>
          Password
          <input
            required
            minLength="6"
            type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>

        {error && <div className="notice error-notice">{error}</div>}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
