// src/pages/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="block mb-2 p-2 border w-full" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block mb-2 p-2 border w-full" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block mb-2 p-2 border w-full" />
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
};

export default Register;