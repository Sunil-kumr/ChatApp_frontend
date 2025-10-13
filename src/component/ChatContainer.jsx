import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../library/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/Authcontext";

const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, getMessages, sendMessage } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const messageContainerRef = useRef(null);
  const isUserAtBottom = useRef(true);
  const [input, setInput] = useState("");

  // 🟣 Fetch messages when a new user is selected
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);

      // Scroll to bottom after messages load (delay ensures DOM is ready)
      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop =
            messageContainerRef.current.scrollHeight;
        }
      }, 200);
    }
  }, [selectedUser]);

  // 🟣 Track scroll position (to detect if user is near bottom)
  const handleScroll = () => {
    if (!messageContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    isUserAtBottom.current = atBottom;
  };

  // 🟣 Scroll to bottom only when near bottom or sending/receiving a message
  useEffect(() => {
    if (isUserAtBottom.current) {
      scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🟣 Send text message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
    isUserAtBottom.current = true; // force scroll down next update
  };

  // 🟣 Send image
  const handleImageSend = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      await sendMessage("", ev.target.result);
      isUserAtBottom.current = true;
    };
    reader.readAsDataURL(file);
  };

  // 🟣 If no user selected
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" alt="" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  // 🟣 UI
  return (
    <div className="h-full flex flex-col backdrop-blur-lg relative">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500 bg-[#1e1e2f] sticky top-0 z-10">
        <img
          src={selectedUser.avatar || assets.profile_martin}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-white text-lg flex items-center gap-2">
          {selectedUser.fullName || selectedUser.email}
          <span
            className={`w-2 h-2 rounded-full ${
              onlineUsers.includes(selectedUser._id)
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
          ></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* ===== Messages ===== */}
      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 pb-6 scroll-smooth"
      >
        {messages.map((message, index) => {
          const isMe = message.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`flex w-full mb-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <img
                src={
                  isMe
                    ? authUser.avatar || assets.profile_martin
                    : selectedUser.avatar || assets.profile_martin
                }
                alt=""
                className={`w-8 h-8 rounded-full self-end ${
                  isMe ? "ml-2" : "mr-2"
                }`}
              />
              <div
                className={`flex flex-col max-w-[70%] ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {message.image ? (
                  <img
                    src={message.image}
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-1"
                  />
                ) : (
                  <p
                    className={`p-2 md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white mb-1 ${
                      isMe ? "rounded-br-none" : "rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
                <p className="text-gray-400 text-xs">
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* ===== Input Bar ===== */}
      <form
        className="p-4 flex items-center gap-2 bg-[#1e1e2f] sticky bottom-0"
        onSubmit={handleSend}
      >
        <div className="flex items-center w-full bg-[#23232f] rounded-full px-4 py-2">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <label className="cursor-pointer flex items-center ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-400 hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
              <path d="M8 12h8M12 8v8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSend}
            />
          </label>
          <button
            type="submit"
            className="ml-2 bg-violet-600 hover:bg-violet-700 text-white w-9 h-9 flex items-center justify-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
