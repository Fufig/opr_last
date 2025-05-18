import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, setToken, clearToken, getToken } from "../api";

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // проверяем токен при загрузке
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    apiFetch("/api/auth/me")
      .then(setUser)
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (login, password) => {
    try {
      const token = btoa(`${login}:${password}`);
      setToken(token);
      const me = await apiFetch("/api/auth/me");
      setUser(me);
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

  return (
    <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
  );
}