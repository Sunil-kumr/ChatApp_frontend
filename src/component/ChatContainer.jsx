import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../library/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, getMessages, sendMessage } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const messageContainerRef = useRef(null);
  const isUserAtBottom = useRef(true);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (isUserAtBottom.current) {
      scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
    isUserAtBottom.current = true;
  };

  // ✅ BASE64 IMAGE SEND (NO MULTER)
  const handleImageSend = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage("", reader.result); // base64
      isUserAtBottom.current = true;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" alt="" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col backdrop-blur-lg relative">
      {/* Header */}
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
          />
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
      </div>

      {/* Messages */}
      <div
        ref={messageContainerRef}
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
              <div
                className={`flex flex-col max-w-[70%] ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {message.image ? (
                  <img
                    src={message.image}
                    className="max-w-[230px] rounded-lg mb-1"
                  />
                ) : (
                  <p className="p-2 text-sm rounded-lg bg-violet-500/30 text-white mb-1">
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
        <div ref={scrollEnd} />
      </div>

      {/* Input */}
      <form
        className="p-4 flex items-center gap-2 bg-[#232331]"
        onSubmit={handleSend}
      >
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-white"
          placeholder="Send a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
<label className="relative group cursor-pointer">
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageSend}
  />

  {/* Camera Button */}
  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#2E2F3E] 
                  group-hover:bg-[#3B3C4F] transition shadow-md">
    <span className="text-xl ">📷</span>
  </div>

  {/* Tooltip */}
  <span className="absolute -top-9 left-1/2 -translate-x-1/2 
                   text-xs bg-black/80 text-white px-2 py-1 rounded 
                   opacity-0 group-hover:opacity-100 transition">
    Camera
  </span>
</label>


<button
  type="submit"
  className="relative group flex items-center justify-center 
             w-11 h-11 rounded-full 
             bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] 
             text-white shadow-lg 
             hover:scale-105 active:scale-95 transition"
>
  <span className="text-xl">➤</span>

  {/* Tooltip */}
  <span
    className="absolute -top-9 left-1/2 -translate-x-1/2 
               text-xs bg-black/80 text-white px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 transition"
  >
    Send
  </span>
</button>


      </form>
    </div>
  );
};

export default ChatContainer;
