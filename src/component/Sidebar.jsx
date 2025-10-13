import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { ChatContext } from '../context/ChatContext';

const Sidebar = () => {
  const { getAllUsers, users, selectedUser, setSelectedUser, unseenMessages } = useContext(ChatContext);
  const { authUser, logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter(user => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  useEffect(() => {
    getAllUsers();
  }, [onlineUsers]);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* --- Top Logo & Menu --- */}
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />

          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-30 w-36 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 shadow-lg transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm py-2 px-2 hover:bg-violet-600 rounded'>Edit profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={() => logout()} className='cursor-pointer text-sm py-2 px-2 hover:bg-violet-600 rounded'>Logout</p>
            </div>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input
            type="text"
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
            placeholder='search_user...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* --- Users List --- */}
      <div className='flex flex-col'>
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => setSelectedUser(user)}
            key={user._id || index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded-lg cursor-pointer max-sm:text-sm ${selectedUser && selectedUser._id === user._id ? 'bg-[#282142]/50' : ''}`}
          >
            <img
              src={user?.avatar || assets.avatar_icon}
              alt={user.fullName}
              className='w-[35px] aspect-[1/1] rounded-full'
            />
            <div className='flex flex-col'>
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id)
                ? <span className='text-green-500 text-xs'>Online</span>
                : <span className='text-neutral-500 text-xs'>Offline</span>
              }
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* --- Logged-in User at Bottom (optional) --- */}
      <div className="mt-5 flex items-center gap-2">
        <img
          src={authUser?.avatar || assets.profile_martin}
          alt={authUser?.fullName || "You"}
          className="w-[35px] aspect-[1/1] rounded-full"
        />
        <p className="text-white text-sm">{authUser?.fullName || "You"}</p>
      </div>
    </div>
  );
};

export default Sidebar;
