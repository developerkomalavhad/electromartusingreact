import { Link } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import ProductCard from "../../components/ProductCard/ProductCard";
import { resolveProductImage } from "../../utils/productImages";
import "./Home.css";

function Home({ products, onAddToCart }) {
  const featuredProducts = products.slice(0, 4);
  const categories = [
    {
      name: "Laptops",
      text: "Work-ready machines for creators, students, and teams.",
      image: resolveProductImage(
        products.find((product) => product.category === "Laptop")?.image
      ),
      to: "/products",
    },
    {
      name: "Mobiles",
      text: "Fast phones with bright displays, sharp cameras, and long battery life.",
      image: resolveProductImage(
        products.find((product) => product.category === "Mobile")?.image
      ),
      to: "/products",
    },
  ];

  return (
    <>
      <Hero />

      <section className="trust-strip">
        <div>
          <strong>6</strong>
          <span>Curated devices</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>Dispatch promise</span>
        </div>
        <div>
          <strong>4.5+</strong>
          <span>Average rating</span>
        </div>
      </section>

      <section className="category-showcase">
        <div className="section-heading">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Jump straight into the devices your customers search for most.
            </p>
          </div>
          <Link className="button ghost" to="/products">
            View All
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-tile" key={category.name} to={category.to}>
              <img src={category.image} alt={category.name} />
              <div>
                <h3>{category.name}</h3>
                <p>{category.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="products">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">
          A compact selection of laptops and mobiles for work, study, and daily life.
        </p>

        <div className="grid">
          {featuredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      <section className="service-panel">
        <div>
          <span>01</span>
          <h3>Verified products</h3>
          <p>Every listing has clean details, product photos, and useful buying signals.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Easy checkout</h3>
          <p>Customers can move from product selection to order placement in a few clicks.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Responsive design</h3>
          <p>The interface adapts smoothly for mobile, tablet, and desktop shoppers.</p>
        </div>
      </section>

      <section className="newsletter-band">
        <div>
          <h2>Get launch offers first</h2>
          <p>Sign up for product drops, limited deals, and restock alerts.</p>
        </div>
        <form>
          <input aria-label="Email address" placeholder="Email address" type="email" />
          <button className="button" type="submit">
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
}

export default Home;
