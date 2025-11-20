import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";



const FloatingInput = ({
  id,
  Icon,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  autoComplete,
  inputProps = {},
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-5">
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 pointer-events-none`}
        aria-hidden
      >
        <Icon className="w-5 h-5" />
      </div>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        required={required}
        className={`pl-12 pr-4 py-3 w-full rounded-xl bg-white/6 text-white placeholder-transparent focus:outline-none transition
          ${focused ? "ring-2 ring-purple-400/40 border-purple-500" : "border border-white/10"}
        `}
        {...inputProps}
      />

      <label
        htmlFor={id}
        className={`absolute left-12 top-1/2 -translate-y-1/2 text-sm transition-all pointer-events-none
          ${value || focused ? "-translate-y-7 text-xs text-purple-200" : "text-gray-300"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "Empty" };
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  if (score <= 1) return { score, label: "Weak" };
  if (score === 2) return { score, label: "Fair" };
  if (score === 3) return { score, label: "Good" };
  return { score, label: "Strong" };
};

const StrengthBar = ({ score }) => {
  const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400"];
  return (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-2">
      <div
        style={{ width: `${(score / 4) * 100}%` }}
        className={`${colors[Math.max(0, Math.min(3, score - 1))]} h-full transition-all`}
      />
    </div>
  );
};

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = passwordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept terms and conditions.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password); // keep existing context register
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err?.response?.data?.msg || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fb] to-[#eef2ff] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left / Promo Panel */}
        <div className="hidden lg:flex flex-col items-start justify-center p-10 bg-gradient-to-br from-purple-700 to-indigo-600 text-white gap-6">
          <h2 className="text-4xl font-extrabold leading-tight">Join Eventora</h2>
          <p className="text-white/80 max-w-md">
            Create your account to discover curated events, book seats instantly and manage your bookings with ease.
          </p>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-3">
              <span className="bg-white/10 px-2 py-1 rounded text-white text-xs">✓</span>
              Secure and quick signup
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-white/10 px-2 py-1 rounded text-white text-xs">✓</span>
              Personalized event recommendations
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-white/10 px-2 py-1 rounded text-white text-xs">✓</span>
              Easy cancellations and refunds
            </li>
          </ul>

          <div className="mt-6">
            <img
              src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=60"
              alt="events illustration"
              className="rounded-xl shadow-lg w-[320px] object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right / Form */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-sm text-gray-600 mb-6">Sign up to start exploring events near you.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-100 text-sm"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} aria-describedby="register-form" className="space-y-3">
            <FloatingInput
              id="name"
              Icon={User}
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />

            <FloatingInput
              id="email"
              Icon={Mail}
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <FloatingInput
                id="password"
                Icon={Lock}
                label="Password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                inputProps={{ "aria-describedby": "password-strength" }}
              />

              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                className="absolute right-3 top-3 p-1 rounded text-gray-600 hover:text-gray-800"
              >
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              <div className="mt-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span id="password-strength" className="font-medium">
                    Strength: <span className="text-gray-800 ml-1">{strength.label}</span>
                  </span>
                  <span className="text-xs text-gray-400">Use 8+ chars, mix letters & numbers</span>
                </div>
                <StrengthBar score={strength.score} />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/security-policy" className="text-indigo-600 hover:underline">
                  Terms & Privacy
                </Link>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !acceptTerms}
              whileTap={loading || !acceptTerms ? {} : { scale: 0.98 }}
              className={`w-full mt-4 py-3 rounded-xl font-semibold text-white shadow ${
                loading || !acceptTerms
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600"
              }`}
              aria-disabled={loading || !acceptTerms}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Registering...
                </span>
              ) : (
                "Create account"
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>

          <div className="mt-6 border-t pt-4 text-center text-sm text-gray-400">
            By continuing you agree to receive emails and updates. You can unsubscribe anytime.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
