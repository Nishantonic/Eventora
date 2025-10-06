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
      className="w-full p-3 pl-12 bg-white/10 border border-purple-500/50 text-white placeholder-gray-300 rounded-xl focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition duration-300 backdrop-blur-sm shadow-inner"
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-purple-900/80 to-black">
      <motion.form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md p-8 bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30"
        initial={{ opacity: 1, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }} // 🔹 Runs only once on mount
      >
        <h1 className="text-4xl font-extrabold mb-8 text-white text-center tracking-wider">
          Create Account
        </h1>

        {error && (
          <motion.div 
            initial={{ opacity: 1, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-3 mb-4 bg-red-800/50 text-red-300 border border-red-500 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <InputField Icon={User} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} name="name" />
        <InputField Icon={Mail} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" />
        <InputField Icon={Lock} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" />

        <motion.button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 mt-4 rounded-xl font-bold text-lg transition duration-300 flex items-center justify-center gap-2 ${
            loading 
              ? 'bg-purple-700/50 text-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/40'
          }`}
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Registering...
            </>
          ) : (
            'Register'
          )}
        </motion.button>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 font-semibold hover:text-yellow-300 transition duration-300">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
