import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const InputField = ({ Icon, placeholder, value, onChange, type = "text", name, required = true }) => (
  <div className="relative mb-6">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-3 pl-12 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition duration-300 backdrop-blur-md shadow-inner"
    />
  </div>
);

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl text-white"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
        >
          Create Account
        </motion.h1>

        <p className="text-center text-gray-300 mb-6">
          Join <span className="text-purple-300 font-semibold">Eventora</span> and start exploring amazing events.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 mb-4 bg-red-800/40 border border-red-500/40 text-red-300 rounded-lg text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField Icon={User} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} name="name" />
          <InputField Icon={Mail} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" />
          <InputField Icon={Lock} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" />

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={loading ? {} : { scale: 0.97 }}
            className={`w-full py-3 mt-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition duration-300 ${
              loading
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Registering...
              </>
            ) : (
              'Register'
            )}
          </motion.button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-300 hover:text-pink-300 font-semibold transition"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
