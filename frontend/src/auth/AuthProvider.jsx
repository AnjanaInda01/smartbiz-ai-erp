import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, meApi } from "../api/authApi";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      localStorage.removeItem("me");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await meApi();
      setUser(res.data);
      localStorage.setItem("me", JSON.stringify(res.data));
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("me");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    localStorage.setItem("accessToken", res.data.token);
    await loadMe();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("me");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, reloadMe: loadMe }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
