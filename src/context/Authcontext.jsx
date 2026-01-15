import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import api from "../api/api";

export const AuthContext = createContext({
  api: null,
  authUser: null,
  socket: null,
  onlineUsers: [],
  login: () => {},
  signup: () => {},
  logout: () => {},
  updateProfile: () => {}, // ✅ added
});

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  const connectSocket = (user) => {
    if (!user || socketRef.current) return;

    const socket = io(backendURL, {
      query: { userId: user._id },
    });

    socket.on("getOnlineUsers", setOnlineUsers);
    socketRef.current = socket;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/api/auth/check");
        if (data.success) {
          setAuthUser(data.user);
          connectSocket(data.user);
        }
      } catch {
        localStorage.removeItem("token");
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/api/auth/login", credentials);
    if (data.success) {
      localStorage.setItem("token", data.token);
      setAuthUser(data.user);
      connectSocket(data.user);
      toast.success("Login successful");
    }
    return data;
  };

  const signup = async (credentials) => {
    const { data } = await api.post("/api/auth/signup", credentials);
    if (data.success) {
      localStorage.setItem("token", data.token);
      setAuthUser(data.user);
      connectSocket(data.user);
      toast.success("Signup successful");
    }
    return data;
  };

  // ✅ ONLY THIS FUNCTION ADDED
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put(
        "/api/auth/updateProfile",
        profileData
      );

      if (data.success) {
        setAuthUser(data.user); // 🔥 updates UI instantly
        toast.success("Profile updated");
      }

      return data;
    }catch (error) {
  console.log("UPDATE PROFILE ERROR 👉", error.response?.data);
  console.log("STATUS 👉", error.response?.status);
  toast.error(error.response?.data?.message || "Profile update failed");
}

  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setOnlineUsers([]);
    socketRef.current?.disconnect();
    socketRef.current = null;
    toast.success("Logged out");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        api,
        authUser,
        socket: socketRef.current,
        onlineUsers,
        login,
        signup,
        logout,
        updateProfile, // ✅ added
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
