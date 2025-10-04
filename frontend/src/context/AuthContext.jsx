// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, role: decoded.role });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: res.data.user.id, role: res.data.user.role });
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/users/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: res.data.id, role: res.data.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};