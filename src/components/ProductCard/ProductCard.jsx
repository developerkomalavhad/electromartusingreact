import "./ProductCard.css";
import { resolveProductImage } from "../../utils/productImages";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card">
      <div className="product-media">
        <img src={resolveProductImage(product.image)} alt={product.name} />
        <span>{product.badge}</span>
      </div>

      <div className="product-info">
        <p>{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-meta">
          <strong>{formatPrice(product.price)}</strong>
          <span>{product.rating} / 5</span>
        </div>
        <p className="description">{product.description}</p>
      </div>

      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
