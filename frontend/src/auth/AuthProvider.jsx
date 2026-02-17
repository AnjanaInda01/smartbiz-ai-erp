import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginApi, meApi } from "../api/authApi";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  // Load cached user first for faster UI (optional but nice)
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("me");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });

    // ✅ backend returns "accessToken" (not "token")
    const token = res.data?.accessToken || res.data?.token;

    if (!token) {
      throw new Error("Login response did not include accessToken");
    }

    localStorage.setItem("accessToken", token);

    // (optional but nice) store basic user from login response immediately
    if (res.data?.role) {
      localStorage.setItem(
        "me",
        JSON.stringify({
          name: res.data?.name,
          email: res.data?.email,
          role: res.data?.role,
          businessId: res.data?.businessId ?? null,
        }),
      );
    }

    // then load full /me (id, businessId, etc)
    await loadMe();
  };

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("me");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      reloadMe: loadMe,
      setUser, // optional, but sometimes helpful
    }),
    [user, loading, login, logout, loadMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
