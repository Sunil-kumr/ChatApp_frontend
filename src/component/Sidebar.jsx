import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
  } = useContext(ChatContext);

  const { authUser, logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
    
  className={`bg-gradient-to-b from-[#1a1734] via-[#574f7d] to-[#1a1833]
  h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
    selectedUser ? "max-md:hidden" : ""
  }`}
>

    
      {/* Top */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-30 w-36 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm py-2 px-2 hover:bg-violet-600 rounded"
              >
                Edit profile
              </p>
              <hr className="my-2 border-gray-500" />
              <p
                onClick={logout}
                className="cursor-pointer text-sm py-2 px-2 hover:bg-violet-600 rounded"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            className="bg-transparent outline-none text-white text-xs flex-1"
            placeholder="search_user..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* Users */}
      <div className="flex flex-col">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded-lg cursor-pointer ${
              selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
            }`}
          >
            <img
              src={user.profilePicture || assets.avatar_icon}
              className="w-[35px] rounded-full"
            />
            <div>
              <p>{user.fullName}</p>
              <span
                className={`text-xs ${
                  onlineUsers.includes(user._id)
                    ? "text-green-500"
                    : "text-neutral-500"
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>

            {unseenMessages[user._id] > 0 && (
              <span className="absolute right-4 top-4 h-5 w-5 rounded-full bg-violet-500 text-xs flex items-center justify-center">
                {unseenMessages[user._id]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-5 flex items-center gap-2">
        <img
          src={authUser?.profilePicture || assets.profile_martin}
          className="w-[35px] rounded-full"
        />
        <p className="text-sm">{authUser?.fullName}</p>
      </div>
    </div>
  );
};

export default Sidebar;
