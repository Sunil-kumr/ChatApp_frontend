import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);

  const [isSignup, setIsSignup] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Email and password are required!");
      return false;
    }
    if (isSignup && !fullName) {
      toast.error("Please enter your name!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const credentials = isSignup
        ? { fullName, email, password, bio }
        : { email, password };

      const result = isSignup
        ? await signup(credentials)
        : await login(credentials);

      if (result?.success) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#292939] to-[#6D28D9]">

    <div className="bg-white backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 w-full max-w-md border border-white/20">

        <h2 className="text-gray-900 text-3xl font-bold text-center mb-2">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {isSignup
            ? "Join QuickChat and start chatting"
            : "Sign in to continue chatting"}
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            disabled={loading}
            type="submit"
            className="mt-2 w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={toggleMode}
            className="text-sm text-violet-600 hover:underline font-medium"
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
