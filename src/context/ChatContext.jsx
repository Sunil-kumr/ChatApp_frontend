import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { api, socket, authUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const getUsers = async () => {
    const { data } = await api.get("/api/message/users");
    if (data.success) {
      setUsers(data.users);
      setUnseenMessages(data.unseenMessagesCount || {});
    }
  };

const getMessages = async (userId) => {
  try {
    const { data } = await api.get(`/api/message/${userId}`);
    if (data.success) {
      setMessages(data.messages);

      // ✅ clear unseen count only
      setUnseenMessages((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    }
  } catch {
    toast.error("Failed to load messages");
  }
};

  // ✅ BASE64 SEND
  const sendMessage = async (text, image = "") => {
    if (!selectedUser) return;

    try {
      const { data } = await api.post(
        `/api/message/send/${selectedUser._id}`,
        { text, image }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        socket?.emit("sendMessage", {
          to: selectedUser._id,
          message: data.message,
        });
      }
    } catch {
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => socket.off("newMessage");
  }, [socket]);

  useEffect(() => {
    if (authUser) getUsers();
  }, [authUser]);

  return (
    <ChatContext.Provider
      value={{
        users,
        messages,
        unseenMessages,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
