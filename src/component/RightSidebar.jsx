import React, { useContext, useMemo } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/Authcontext";
import { ChatContext } from "../context/ChatContext";

const RightSidebar = () => {
  const { authUser, logout, onlineUsers } = useContext(AuthContext);
  const { selectedUser, messages } = useContext(ChatContext);

  // Hide RightSidebar if no user selected
  if (!selectedUser) return null;

  // Check if selected user is online
  const isOnline = onlineUsers.includes(selectedUser._id);

  // Extract image messages (media gallery)
  const mediaImages = useMemo(() => {
    return messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image)
      .slice(-6) // Show last 6 only
      .reverse();
  }, [messages]);

  return (
    <div className="h-full w-full bg-[#181A2A]/80 flex flex-col rounded-l-2xl overflow-hidden">
      {/* --- Profile Section --- */}
      <div className="flex flex-col items-center py-8 border-b border-[#282142]">
        <div className="relative">
          <img
            src={selectedUser?.avatar || assets.profile_martin}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#6C63FF] mb-3"
          />
          <span
            className={`absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-[#181A2A] ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
        </div>

        <span className="text-white font-semibold text-xl mt-2">
          {selectedUser?.fullName || "Unknown User"}
        </span>

        <p className="text-gray-300 text-sm mt-1 px-4 text-center">
          {selectedUser?.bio || "Hey there! I'm using QuickChat"}
        </p>
      </div>

      {/* --- Media Section --- */}
      <div className="flex-1 flex flex-col px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6C63FF]/50 scrollbar-track-transparent">
        <p className="text-white font-semibold mb-3">Media</p>

        {mediaImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mediaImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`media-${idx + 1}`}
                className="w-full h-16 object-cover rounded-lg hover:scale-105 transition-transform"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No media shared yet</p>
        )}
      </div>

      {/* --- Logout Section --- */}
      <div className="px-6 pb-6 mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img
              src={authUser?.avatar || assets.profile_martin}
              alt="You"
              className="w-8 h-8 rounded-full object-cover border border-[#6C63FF]"
            />
            <p className="text-white text-sm">{authUser?.fullName || "You"}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2 rounded-full bg-gradient-to-r from-[#a084ee] to-[#6C63FF] 
                     text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
