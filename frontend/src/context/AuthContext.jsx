
import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 
import axios from "axios";
import api from "../utils/api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); 
      } catch (error) {
        console.error("JWT Decode Error:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      if (token) console.warn("Invalid token format:", token);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);

      // Use available fields safely (role might not exist)
      setUser({
        id: res.data.user.id,
        role: res.data.user.role || "user",
        email: res.data.user.email,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/api/users/register", { name, email, password });
      localStorage.setItem("token", res.data.token);

      setUser({
        id: res.data.user.id,
        role: res.data.user.role || "user",
        email: res.data.user.email,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
