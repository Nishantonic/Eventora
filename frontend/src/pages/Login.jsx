import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      console.error("Login failed:", err);
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
      <motion.div
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl max-w-md w-full p-8 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Welcome Back 👋
        </motion.h1>
        <p className="text-center text-gray-300 mb-8">
          Log in to continue your journey with <span className="text-purple-300 font-semibold">Eventora</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block mb-2 font-medium text-gray-300">
              Email Address
            </label>
            <div className="flex items-center bg-white/5 border border-white/20 rounded-xl focus-within:border-purple-400 transition">
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

          {/* Password Field */}
          <div>
            <label className="block mb-2 font-medium text-gray-300">
              Password
            </label>
            <div className="flex items-center bg-white/5 border border-white/20 rounded-xl focus-within:border-pink-400 transition">
              <Lock className="w-5 h-5 text-pink-300 ml-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-center text-sm font-medium mt-2">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
              submitting
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg"
            }`}
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-300 hover:text-pink-300 font-semibold transition"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
