import { useMemo, useState } from "react";
import "./AdminUsers.css";

function AdminUsers({ users, onUpdateStatus }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => role === "All" || user.role === role)
        .filter((user) =>
          `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())
        ),
    [users, query, role]
  );

  return (
    <main className="page admin-users">
      <div>
        <h1 className="section-title">Customer Management</h1>
        <p className="section-subtitle">
          Review registered customers, filter accounts, and activate or block users.
        </p>
      </div>

      <section className="user-summary">
        <div>
          <span>Total users</span>
          <strong>{users.length}</strong>
        </div>
        <div>
          <span>Active</span>
          <strong>{users.filter((user) => user.status === "Active").length}</strong>
        </div>
        <div>
          <span>Blocked</span>
          <strong>{users.filter((user) => user.status === "Blocked").length}</strong>
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-title user-tools">
          <h2>Users</h2>
          <div>
            <input
              aria-label="Search users"
              placeholder="Search users"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              aria-label="Filter users by role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option>All</option>
              <option>Admin</option>
              <option>Customer</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                    <span className="subtext">{user.email}</span>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <span className="status-pill">{user.status}</span>
                  </td>
                  <td>
                    <button
                      className="user-action"
                      onClick={() =>
                        onUpdateStatus(
                          user.id,
                          user.status === "Active" ? "Blocked" : "Active"
                        )
                      }
                    >
                      {user.status === "Active" ? "Block" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredUsers.length && (
          <div className="admin-empty">No users match your filters.</div>
        )}
      </section>
    </main>
  );
}

export default AdminUsers;
