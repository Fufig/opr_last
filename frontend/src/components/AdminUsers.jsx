import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    apiFetch("/api/admin/users").then(setList).catch((e) => setErr(e.message));
  }, []);
  if (err) return <p style={{ color: "red" }}>{err}</p>;
  return (
    <div style={{ padding: 20 }}>
      <h2>All users</h2>
      <ul>
        {list.map((u) => (
          <li key={u.id}>
            {u.id}. {u.full_name} ({u.login}) – {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}