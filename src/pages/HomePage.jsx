import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Sidebar from "../component/Sidebar";
import ChatContainer from "../component/ChatContainer";
import RightSidebar from "../component/RightSidebar";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`border rounded-2xl h-full grid ${
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
