import { useMemo, useState } from "react";
import "./AdminOrders.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const statuses = ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"];

function AdminOrders({ orders, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(
    () =>
      orders
        .filter((order) => statusFilter === "All" || order.status === statusFilter)
        .filter((order) =>
          `${order.customer} ${order.email} ${order.id}`
            .toLowerCase()
            .includes(query.toLowerCase())
        ),
    [orders, query, statusFilter]
  );

  return (
    <main className="page admin-orders">
      <div>
        <h1 className="section-title">Order Management</h1>
        <p className="section-subtitle">
          Search orders, check payment details, and update fulfillment status.
        </p>
      </div>

      <section className="admin-panel">
        <div className="panel-title order-tools">
          <h2>Orders</h2>
          <div>
            <input
              aria-label="Search orders"
              placeholder="Search order or customer"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              aria-label="Filter orders by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <strong>{order.customer}</strong>
                    <span className="subtext">{order.email}</span>
                  </td>
                  <td>{order.items}</td>
                  <td>{order.payment}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>{order.date}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(event) =>
                        onUpdateStatus(order.id, event.target.value)
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredOrders.length && (
          <div className="admin-empty">No orders match your filters.</div>
        )}
      </section>
    </main>
  );
}

export default AdminOrders;
