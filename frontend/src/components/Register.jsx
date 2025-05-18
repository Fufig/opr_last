import { useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                Login
              </label>
              <input
                id="login"
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
                Telegram
              </label>
              <input
                id="telegram"
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                required
                placeholder="@username"
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="input mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "btn btn-primary w-full",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}