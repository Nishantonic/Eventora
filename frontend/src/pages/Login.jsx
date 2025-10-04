// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block mb-2 p-2 border w-full" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block mb-2 p-2 border w-full" />
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
};

export default Login;