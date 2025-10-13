import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/Authcontext";
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

      const result = isSignup ? await signup(credentials) : await login(credentials);

      if (result?.success) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[70vw] h-[70vw] left-1/4 top-[-10%] rounded-full bg-[#6C63FF]/40 blur-[100px]"></div>
        <div className="absolute w-[60vw] h-[60vw] right-[-10%] bottom-[-10%] rounded-full bg-[#6C63FF]/30 blur-[120px]"></div>
      </div>

      {/* Centered form */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center gap-6">
        {/* Logo */}
   <div className="flex items-center mb-4 gap-4">
  <img
    src={assets.logo_icon || assets.logo}
    alt="logo"
    className="w-16 h-16"
  />
  <h1 className="text-white text-4xl font-bold">QuickChat</h1>
</div>


        {/* Form container */}
        <div className="bg-[#181A2A]/90 rounded-2xl shadow-lg p-8 w-full flex flex-col gap-4 border border-gray-700">
          <h2 className="text-white text-2xl font-semibold text-center mb-4">
            {isSignup ? "Sign up" : "Sign in"}
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                className="bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
  type="submit"
  disabled={loading}
  className="mx-auto px-10 py-2 rounded-lg bg-gradient-to-r from-[#a084ee] to-[#6C63FF] text-white font-semibold text-lg disabled:opacity-50"
>
  {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
</button>

          </form>

          {/* Footer links */}
          <div className="flex justify-between mt-2">
            {isSignup ? (
              <button
                type="button"
                className="text-xs text-[#a084ee] hover:underline ml-auto"
                onClick={toggleMode}
              >
                Login
              </button>
            ) : (
              <>
                <a href="#" className="text-xs text-[#a084ee] hover:underline">
                  Forgot password?
                </a>
                <button
                  type="button"
                  className="text-xs text-[#a084ee] hover:underline"
                  onClick={toggleMode}
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
