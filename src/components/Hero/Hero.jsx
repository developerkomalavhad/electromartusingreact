import { Link } from "react-router-dom";
import heroBg from "../../assets/images/ hero-bg.jpg";
import "./Hero.css";

function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(8, 13, 24, 0.88), rgba(8, 13, 24, 0.52), rgba(8, 13, 24, 0.18)), url(${heroBg})`,
      }}
    >
      <div className="hero-content">
        <p className="hero-label">Premium electronics store</p>
        <h1>Latest Laptops and Mobiles at Best Prices</h1>
        <p>
          Shop trusted devices with fast delivery, clean product details, and a
          simple checkout experience.
        </p>

        <div className="hero-actions">
          <Link className="button" to="/products">
            Shop Now
          </Link>
          <Link className="button hero-outline" to="/contact">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
