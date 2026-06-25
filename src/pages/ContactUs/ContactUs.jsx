import { useState } from "react";
import "./ContactUs.css";

function ContactUs() {
  const [sent, setSent] = useState(false);

  return (
    <main className="page contact-page">
      <section>
        <h1 className="section-title">Contact ElectroMart</h1>
        <p className="section-subtitle">
          ElectroMart is your local computer shop for laptops, mobiles,
          accessories, and quick product support near Shevgaon Tahsil.
        </p>

        <div className="contact-details">
          <div>
            <strong>Shop Name</strong>
            <span>ElectroMart Computer Shop</span>
          </div>
          <div>
            <strong>Email</strong>
            <span>support@electromart.test</span>
          </div>
          <div>
            <strong>Phone</strong>
            <a href="tel:+919373899248">+91 93738 99248</a>
          </div>
          <div>
            <strong>Address</strong>
            <span>Near Tahsil Office, Shevgaon, Ahmednagar, Maharashtra</span>
          </div>
          <div>
            <strong>Hours</strong>
            <span>10:00 AM - 7:00 PM</span>
          </div>
        </div>

        <div className="map-card">
          <div>
            <strong>Find us on map</strong>
            <span>Near Tahsil Office, Shevgaon</span>
          </div>
          <iframe
            title="ElectroMart location near Shevgaon Tahsil"
            loading="lazy"
            src="https://www.google.com/maps?q=Shevgaon%20Tahsil%20Office%20Shevgaon%20Ahmednagar%20Maharashtra&output=embed"
          />
        </div>
      </section>

      <form
        className="form-panel"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <label>
          Name
          <input required placeholder="Your name" />
        </label>
        <label>
          Email
          <input required type="email" placeholder="you@example.com" />
        </label>
        <label>
          Message
          <textarea required placeholder="How can we help?" />
        </label>
        {sent && <div className="notice">Message sent successfully.</div>}
        <button className="button" type="submit">
          Send Message
        </button>
      </form>
    </main>
  );
}

export default ContactUs;
