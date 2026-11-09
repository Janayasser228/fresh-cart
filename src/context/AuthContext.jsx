import { createContext, useContext, useEffect, useState } from "react";
import api, { decodeToken } from "../api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // نتأكد إن التوكن لسه صالح لما الموقع يفتح
  useEffect(() => {
    if (!token) return;
    api.get("/auth/verifyToken").catch(() => logout());
    // eslint-disable-next-line
  }, []);

  const decoded = token ? decodeToken(token) : null;
  const user = decoded ? { id: decoded.id, name: decoded.name } : null;

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
  );
}
