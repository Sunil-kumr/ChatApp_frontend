import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, authUser, axios } = useContext(AuthContext);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/users");
      if (data?.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessagesCount || {});
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  // Fetch messages with a selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data?.success) {
        setMessages(data.messages);
        setSelectedUser(data.user || users.find(u => u._id === userId));
        // Mark unseen messages as seen locally
        setUnseenMessages(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  // Send message (text or image)
  const sendMessage = async (text, image = null) => {
    if (!selectedUser) return;
    try {
      const payload = { text };
      if (image) payload.image = image;

      const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, payload);

      if (data?.success) {
        setMessages(prev => [...prev, data.message]);
        // Emit via socket to receiver
        if (socket) {
          socket.emit("sendMessage", {
            to: selectedUser._id,
            message: data.message,
          });
        }
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (selectedUser && message.senderId === selectedUser._id) {
        message.seen = true;
        setMessages(prev => [...prev, message]);
        axios.put(`/api/message/markAsSeen/${message._id}`);
      } else {
        setUnseenMessages(prev => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        }));
      }
    };

    const handleNewUser = (user) => {
      setUsers(prev => [...prev, user]);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newUser", handleNewUser);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newUser", handleNewUser);
    };
  }, [socket, selectedUser]);

  const value = {
    users,
    messages,
    unseenMessages,
    selectedUser,
    getAllUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    setUnseenMessages,
    setMessages,
    setUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
