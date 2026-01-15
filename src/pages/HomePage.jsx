import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Sidebar from "../component/Sidebar";
import ChatContainer from "../component/ChatContainer";
import RightSidebar from "../component/RightSidebar";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    // 🌈 SAME BACKGROUND AS LOGIN PAGE
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#232231] to-[#592f9c] flex items-center justify-center sm:px-[15%] sm:py-[5%]">
      
      {/* Glass container */}
      <div
        className={`w-full h-full rounded-2xl border border-white/20 
        bg-white/10 backdrop-blur-xl shadow-2xl grid ${
          selectedUser
            ? "md:grid-cols-[250px_1fr_250px]"
            : "md:grid-cols-[350px_1fr]"
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>

    </div>
  );
};

export default HomePage;
