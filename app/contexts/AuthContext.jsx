"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({ user: null, login: () => false, logout: () => {} });

const MOCK_USERS = [
  { name: "Tharun R Gowda", email: "tharun@dark.com", password: "dark123", phone: "+91 98765 43210", address: "HSR Layout, Bangalore, KA 560102", avatar: "T" },
  { name: "Alex Kumar",      email: "alex@dark.com",   password: "dark123", phone: "+91 91234 56789", address: "Indiranagar, Bangalore, KA", avatar: "A" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("dc_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem("dc_user", JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dc_user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
