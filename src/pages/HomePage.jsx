import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext'; 
import Sidebar from '../component/Sidebar';
import ChatContainer from '../component/ChatContainer';
import RightSidebar from '../component/RightSidebar';

const HomePage = () => {
    const { selectedUser } = useContext(ChatContext);

    return (
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%] '>
            
            <div 
                className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl 
                           overflow-hidden h-[100%]
                           grid grid-cols-1 relative 
                           ${selectedUser 
                               ? 'md:grid-cols-[250px_1fr_250px] xl:grid-cols-[300px_2fr_1fr]' 
                               : 'md:grid-cols-[350px_1fr]'
                            }
                        `} 
            >
                <Sidebar />
                <ChatContainer />
                <RightSidebar />
            </div>
        </div>
    );
};

export default HomePage;