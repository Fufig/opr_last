import { useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: "",
    full_name: "",
    telegram: "",
    password: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      navigate("/login");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h2>Register</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label>Login:</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label>Telegram:</label>
          <input
            type="text"
            name="telegram"
            value={formData.telegram}
            onChange={handleChange}
            required
            placeholder="@username"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #ccc"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}