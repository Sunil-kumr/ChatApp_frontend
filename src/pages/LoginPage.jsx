import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext"; // ✅ FIXED CASE
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
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="bg-white rounded-2xl border-yellow-900 p-8 w-full max-w-md">
        <h2 className="text-black text-2xl text-center mb-4">
          {isSignup ? "Sign up" : "Sign in"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button disabled={loading} type="submit">
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button onClick={toggleMode}>
          {isSignup ? "Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
