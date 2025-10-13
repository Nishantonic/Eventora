// src/components/Header.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { User, LogOut, Ticket, Download } from 'lucide-react';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role === null) {
      const fetchRole = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");
          const res = await api.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(res.data.role);
          setName(res.data.username);
        } catch (err) {
          console.error("Error fetching user role:", err);
          setRole(null);
        }
      };
      fetchRole();
    }
  }, [user, role]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const hoverProps = {
    whileHover: { scale: 1.05, boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)" },
    transition: { type: "spring", stiffness: 300, damping: 10 }
  };

  return (
    <nav className="bg-purple-900 h-auto text-white p-2 shadow-lg sticky top-0 z-[100]">
      <div className="container mx-auto flex justify-between h-auto items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-wider">Eventora</Link>

        {/* Hamburger menu (mobile) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center font-medium">
          <motion.div {...hoverProps}>
            <Link to="/events" className="hover:text-purple-300 transition duration-200 block p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
              Events
            </Link>
          </motion.div>

          {user ? (
            <>
              {role === 'admin' && (
                <motion.div {...hoverProps}>
                  <Link to="/admin" className="hover:text-purple-300 transition block p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
                    Admin Dashboard
                  </Link>
                </motion.div>
              )}

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-700 rounded-full hover:bg-purple-600 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Toggle profile menu"
                  aria-expanded={profileOpen}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{name}</span>
                </button>

                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 border border-purple-700/50"
                    role="menu"
                  >
                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <Ticket className="w-4 h-4" /> My Bookings
                    </Link>
                    <Link
                      to="/tickets"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <Download className="w-4 h-4" /> Download Tickets
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/40 w-full text-left focus:outline-none focus:ring-2 focus:ring-red-500"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <motion.div {...hoverProps}>
                <Link to="/login" className="hover:text-purple-300 transition duration-200 block p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
                  Login
                </Link>
              </motion.div>
              <motion.div {...hoverProps}>
                <Link to="/register" className="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-600 transition duration-200 block focus:outline-none focus:ring-2 focus:ring-purple-500">
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="absolute left-0 w-full md:hidden flex flex-col space-y-3 top-full bg-purple-800 rounded-b-lg p-3 shadow-lg"
      >
        <Link 
          to="/events" 
          className="flex items-center gap-2 hover:text-purple-300 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
          onClick={() => setIsOpen(false)}
        >
          Events
        </Link>
        {user ? (
          <>
            {role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-yellow-300 hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <Link 
              to="/my-bookings" 
              className="flex items-center gap-2 hover:text-purple-300 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              <Ticket className="w-4 h-4" /> My Bookings
            </Link>
            <Link 
              to="/tickets" 
              className="flex items-center gap-2 hover:text-purple-300 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              <Download className="w-4 h-4" /> Download Tickets
            </Link>
            <button 
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/");
              }} 
              className="flex items-center gap-2 hover:text-red-300 text-left transition focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="flex items-center gap-2 hover:text-purple-300 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="flex items-center gap-2 hover:text-purple-300 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </motion.div>
    </nav>
  );
};

export default Header;