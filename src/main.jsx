import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        {/* 🌈 SAME BACKGROUND AS LOGIN PAGE */}
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#4F46E5] to-[#6D28D9]">
          <App />
        </div>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);
