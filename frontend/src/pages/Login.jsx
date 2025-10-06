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
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/80 to-black flex items-center justify-center px-4">
      <motion.div
        className="bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-purple-600/40"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-400">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Please login to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Email</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="flex-1 p-3 bg-transparent focus:outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Password</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg">
              <Lock className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="flex-1 p-3 bg-transparent focus:outline-none text-white"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              submitting
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            }`}
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
