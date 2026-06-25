import { useMemo, useState } from "react";
import { getProductId, resolveProductImage } from "../../utils/productImages";
import "./AdminProducts.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const emptyForm = {
  name: "",
  category: "Laptop",
  price: "",
  rating: "4.5",
  stock: "10",
  image: "",
  badge: "New",
  description: "",
};

function AdminProducts({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const fallbackImage = products[0]?.image || "";
  const [form, setForm] = useState({ ...emptyForm, image: fallbackImage });
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      if (editingId) {
        await onUpdateProduct(editingId, form);
        setMessage("Product updated successfully.");
      } else {
        await onAddProduct(form);
        setMessage("Product added successfully.");
      }

      setEditingId(null);
      setForm({ ...emptyForm, image: fallbackImage });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(getProductId(product));
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      stock: product.stock || 0,
      image: product.image,
      badge: product.badge,
      description: product.description,
    });
  };

  return (
    <main className="page admin-products">
      <section>
        <h1 className="section-title">Product Management</h1>
        <p className="section-subtitle">
          Add products, edit catalog details, update pricing, and remove unavailable items.
        </p>

        <form className="admin-product-form" onSubmit={handleSubmit}>
          <label>
            Product name
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
            >
              <option>Laptop</option>
              <option>Mobile</option>
              <option>Accessory</option>
            </select>
          </label>
          <label>
            Price
            <input
              required
              min="1"
              type="number"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
            />
          </label>
          <label>
            Rating
            <input
              required
              max="5"
              min="1"
              step="0.1"
              type="number"
              value={form.rating}
              onChange={(event) =>
                setForm({ ...form, rating: event.target.value })
              }
            />
          </label>
          <label>
            Stock
            <input
              required
              min="0"
              type="number"
              value={form.stock}
              onChange={(event) =>
                setForm({ ...form, stock: event.target.value })
              }
            />
          </label>
          <label>
            Badge
            <input
              required
              value={form.badge}
              onChange={(event) => setForm({ ...form, badge: event.target.value })}
            />
          </label>
          <label>
            Image key or URL
            <input
              required
              placeholder="hp, dell, iphone, or image URL"
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
            />
          </label>
          <label className="wide-field">
            Description
            <textarea
              required
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </label>
          <div className="form-actions wide-field">
            <button className="button secondary" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
            </button>
            {editingId && (
              <button
                className="button ghost"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ ...emptyForm, image: fallbackImage });
                }}
              >
                Cancel
              </button>
            )}
          </div>
          {message && <div className="notice wide-field">{message}</div>}
        </form>
      </section>

      <section className="admin-panel">
        <div className="panel-title">
          <h2>Catalog Items</h2>
          <input
            aria-label="Search admin products"
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={getProductId(product)}>
                  <td className="product-cell">
                    <img src={resolveProductImage(product.image)} alt={product.name} />
                    <span>{product.name}</span>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.rating}</td>
                  <td>{product.stock ?? 0}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => editProduct(product)}>Edit</button>
                      <button onClick={() => onDeleteProduct(getProductId(product))}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminProducts;
