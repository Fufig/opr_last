// src/components/AdminUsers.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../api"; // Assuming api.js
import './AdminUser.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/admin/users")
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-indicator">Loading users...</div>;
  }

  if (error) {
    return <p className="error-message">Error fetching users: {error}</p>;
  }

  return (
    <div className="admin-users-container">
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-list-item">
              <div className="user-info">
                <span className="user-name">{user.full_name}</span> ({user.login})
              </div>
              <span className={`user-role role-${user.role}`}>{user.role}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}