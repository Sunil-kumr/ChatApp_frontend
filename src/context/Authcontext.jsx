import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Connect socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendURL, {
      query: { userId: userData._id },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => console.log("✅ Socket connected:", newSocket.id));
    newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    newSocket.on("connect_error", (err) => console.error("Socket error:", err));

    setSocket(newSocket);
  };

  // Check authentication
  const checkAuth = async () => {
    try {
      if (token) axios.defaults.headers.common["token"] = token;
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error.message);
      setToken(null);
      setAuthUser(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["token"];
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/signup", credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Signup successful!");
        return data;
      } else {
        toast.error(data.message || "Signup failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup error!");
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Login successful!");
        return data;
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login error!");
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setToken(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["token"];
    socket?.disconnect();
    setSocket(null);
    toast.success("Logged out successfully ✌️");
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const { data } = await axios.put("/api/auth/updateProfile", formData);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
        return data;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      setLoading(false);
    }

    return () => socket?.disconnect();
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    checkAuth,
    signup,
    login,
    logout,
    updateProfile,
    loading,
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
