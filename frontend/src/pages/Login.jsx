import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-4 relative overflow-hidden">

      {/* Blurry Background Circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl top-10 left-14 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-14 right-10 animate-pulse delay-500"></div>
      </div>

      <motion.div
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-md w-full p-10 text-white relative z-10 space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Heading */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Welcome Back
          </motion.h1>
          <p className="text-gray-300">
            Log in to continue your journey with{" "}
            <span className="text-purple-300 font-semibold">Eventora</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium">Email Address</label>
            <div className="relative flex items-center bg-white/5 border border-white/20 rounded-xl hover:border-purple-400 transition-all">
              <Mail className="w-5 h-5 text-purple-300 ml-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium">Password</label>
            <div className="relative flex items-center bg-white/5 border border-white/20 rounded-xl hover:border-pink-400 transition-all">
              <Lock className="w-5 h-5 text-pink-300 ml-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-300 hover:text-pink-300 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl text-sm"
              >
                <AlertCircle className="w-4 h-4" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
              submitting
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500"
            }`}
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" /> Login
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-300 hover:text-pink-300 font-semibold"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
