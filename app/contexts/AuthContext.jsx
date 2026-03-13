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
    if (email === "tharun@dark.com" && password === "dark123") {
      const newUser = {
        name: "Tharun R Gowda",
        email: "tharun@dark.com",
        phone: "+91 98765 43210",
        address: "HSR Layout, Bangalore, Karnataka",
        avatar: "T",
        joinedDate: "March 2026"
      };
      // Check if user has saved profile data
      const saved = localStorage.getItem("dc_user_profile");
      const userToSet = saved ? JSON.parse(saved) : newUser;

      setUser(userToSet);
      localStorage.setItem("dc_user", JSON.stringify(userToSet));
      return true;
    }
    return false;
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("dc_user", JSON.stringify(newUser));
    localStorage.setItem("dc_user_profile", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dc_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
