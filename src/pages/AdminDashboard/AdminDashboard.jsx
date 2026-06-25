import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function AdminDashboard({ products, orders, users }) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status !== "Delivered").length;
  const lowRatedProducts = products.filter((product) => product.rating < 4.4).length;
  const recentOrders = orders.slice(0, 4);

  return (
    <main className="page admin-page">
      <div className="admin-hero">
        <div>
          <p className="admin-kicker">Admin Control Center</p>
          <h1>Manage ElectroMart</h1>
          <p>
            Track store performance, manage inventory, review orders, and keep customer accounts healthy.
          </p>
        </div>
        <Link className="button" to="/admin/products">
          Add Products
        </Link>
      </div>

      <section className="admin-stats">
        <div>
          <span>Total Revenue</span>
          <strong>{formatPrice(revenue)}</strong>
        </div>
        <div>
          <span>Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div>
          <span>Products</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Customers</span>
          <strong>{users.length}</strong>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-title">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders">View all</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <span className="status-pill">{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-title">
            <h2>Store Alerts</h2>
          </div>
          <div className="alert-list">
            <div>
              <strong>{pendingOrders}</strong>
              <span>orders need fulfillment updates.</span>
            </div>
            <div>
              <strong>{lowRatedProducts}</strong>
              <span>products could use better descriptions or offers.</span>
            </div>
            <div>
              <strong>{products.filter((item) => item.category === "Mobile").length}</strong>
              <span>mobile products are currently listed.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
