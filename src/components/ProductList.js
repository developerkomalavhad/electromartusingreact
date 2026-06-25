/**
 * ProductList Component
 * Displays products from backend API
 */

import React, { useState, useEffect } from "react";
import { productAPI } from "../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (selectedCategory === "All") {
        data = await productAPI.getAll();
      } else {
        data = await productAPI.filterByCategory(selectedCategory);
      }
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Laptop", "Mobile", "Accessory"];

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="products-container">
      <h2>Products</h2>

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={`/images/${product.image}.jpg`} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="description">{product.description}</p>
              <div className="product-info">
                <span className="price">₹{product.price.toLocaleString()}</span>
                <span className="rating">⭐ {product.rating}</span>
              </div>
              <div className="stock">
                {product.stock > 0 ? (
                  <span className="in-stock">In Stock ({product.stock})</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
              {product.featured && <span className="badge">{product.badge}</span>}
              <button className="add-to-cart" disabled={product.stock === 0}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
