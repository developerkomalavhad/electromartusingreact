import { useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";

function Products({ products, onAddToCart }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    const nextProducts = products
      .filter((product) => category === "All" || product.category === category)
      .filter((product) =>
        product.name.toLowerCase().includes(query.trim().toLowerCase())
      );

    if (sort === "low") {
      return [...nextProducts].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      return [...nextProducts].sort((a, b) => b.price - a.price);
    }

    return nextProducts;
  }, [category, products, query, sort]);

  return (
    <main className="page catalog-page">
      <div className="catalog-header">
        <div>
          <h1 className="section-title">Shop Electronics</h1>
          <p className="section-subtitle">
            Browse phones and laptops with simple filters, clear prices, and quick cart actions.
          </p>
        </div>

        <div className="catalog-tools">
          <input
            aria-label="Search products"
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All</option>
            <option>Laptop</option>
            <option>Mobile</option>
          </select>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {!filteredProducts.length && (
        <div className="empty-state">No products match your search.</div>
      )}
    </main>
  );
}

export default Products;
