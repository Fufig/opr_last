import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, setToken, clearToken, getToken } from "../api";

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch and set the current user
  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await apiFetch("/api/auth/me");
      setUser(me);
    } catch (error) {
      clearToken();
      setUser(null);
      console.error("Failed to fetch user:", error); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  // Check token and fetch user on initial load
  useEffect(() => {
    fetchUser();
  }, []); // Empty dependency array means this runs once on mount

  const login = async (login, password) => {
    try {
      const token = btoa(`${login}:${password}`);
      setToken(token);
      await fetchUser(); // Fetch user after setting token
    } catch (error) {
      clearToken();
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  // Add a function to refresh the user data
  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <Ctx.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</Ctx.Provider>
  );
}