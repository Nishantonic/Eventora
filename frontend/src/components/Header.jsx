// src/components/Header.jsx - Updated for mobile menu
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-purple-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl  font-bold">Eventora</Link>
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden md:flex space-x-4">
          <Link to="/events" className="hover:underline">Events</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="hover:underline">Admin</Link>}
              <button onClick={logout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-4">
          <Link to="/events" className="hover:underline">Events</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="hover:underline">Admin</Link>}
              <button onClick={logout} className="hover:underline text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;