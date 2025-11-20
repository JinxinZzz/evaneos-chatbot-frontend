"use client";
import { useState, useEffect, useRef } from "react";

import InputBox from './InputBox';
import PromptList from './PromptList';
import LoadingIndicator from './LoadingIndicator';
import HistoryList from "../history/HistoryList";
import DataChart from "../result/DataChart";
import ErrorTip from "../result/ErrorTip";
import TextResult from "../result/TextResult";

// Define basic message type for chat flow
type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  content: string;
  type?: "text" | "chart" | "history" | "error";
  timestamp: string; // Add timestamp field (format: "YYYY-MM-DD HH:mm:ss")
};

// Define temporary history type (matches HistoryList's required props)
type TempHistoryItem = {
  id: string;
  timestamp: string;
  userMessage: string;
  botResponse: string;
};

export default function ChatContainer() {
  // Helper: Format current time as English (en-GB) - DD/MM/YYYY HH:mm:ss (24h)
  const getFormattedTimestamp = (): string => {
    return new Date().toLocaleString('en-GB', { 
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false 
    });
  };
  // Temporary chat history (ONLY in component memory: resets on refresh)
  const [tempChatHistory, setTempChatHistory] = useState<TempHistoryItem[]>([]);
  // Current chat messages (for real-time chat display)
  
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([
    {
      id: "init-001",
      sender: "bot",
      content: "Hello 😊 I'm your Evaneos assistant. How can I help you today?\nTry asking for 'chart', 'history', 'error', or send a message",
      type: "text",
      timestamp: getFormattedTimestamp()
    },
  ]);
   // Track if bot is typing
  const [isTyping, setIsTyping] = useState(false);
  // Ref for scrolling to bottom
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // Helper: Format current time as "HH:MM" (for temporary history timestamp)
  const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle sending user message & simulating bot reply
  const handleSendMessage = (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message to real-time chat
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: userInput,
      type: "text",
      timestamp: getFormattedTimestamp()
    };
    setCurrentMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate bot response (replace with real API later)
    setTimeout(() => {
      let botMsg: ChatMessage;
      let botResponseContent = "";

      // Determine bot response type
      if (userInput.toLowerCase().includes("chart")) {
        botResponseContent = "Here's the 2025 sales trend chart:";
        botMsg = {
          id: `bot-chart-${Date.now()}`,
          sender: "bot",
          content: botResponseContent,
          type: "chart",
          timestamp: getFormattedTimestamp()
        };
      } else if (userInput.toLowerCase().includes("history")) {
        botResponseContent = "Your recent chat history:";
        botMsg = {
          id: `bot-history-${Date.now()}`,
          sender: "bot",
          content: botResponseContent,
          type: "history",
          timestamp: getFormattedTimestamp()
        };
      } else if (userInput.toLowerCase().includes("error")) {
        botResponseContent = "Simulated error: Failed to load data.";
        botMsg = {
          id: `bot-error-${Date.now()}`,
          sender: "bot",
          content: botResponseContent,
          type: "error",
          timestamp: getFormattedTimestamp()
        };
      } else {
        botResponseContent = `I'm here to assist you! (This is a placeholder — will connect to backend later.`;
        botMsg = {
          id: `bot-text-${Date.now()}`,
          sender: "bot",
          content: botResponseContent,
          type: "text",
          timestamp: getFormattedTimestamp()
        };
      }

      // Update TEMPORARY history (only in memory)
      const newHistoryItem: TempHistoryItem = {
        id: `history-${Date.now()}`,
        timestamp: getCurrentTime(),
        userMessage: userInput,
        botResponse: botResponseContent,
      };
      setTempChatHistory((prev) => [...prev, newHistoryItem]);

      // Add bot message to real-time chat
      setCurrentMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-evaneos-beige text-evaneos-dark">
      {/* HEADER */}
      <header className="flex items-center px-6 py-3 bg-evaneos-dark text-evaneos-beige shadow-md gap-4">
        <div className="bg-evaneos-panel px-3 py-1 rounded">
          <img src="/evaneos-logo.svg" alt="Evaneos logo" className="h-9" />
        </div>
        <span className="text-xl font-semibold tracking-wide">
          Internal Assistant
        </span>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
       {currentMessages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex items-end gap-3 ${
            msg.sender === "user" ? "justify-end" : "justify-start"}`}>
          {/* Avatar */}
          {msg.sender === "bot" && (
            <img
              src="/evaneos-icon.jpeg"
              alt="Bot Avatar"
              className="w-8 h-8 rounded-full border border-evaneos-dark/20 object-cover"
            />
          )}
          {/* Message bubble */}
          <div
            className={`
              px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm max-w-[70%]
              ${
                msg.sender === "user"
                ? "bg-evaneos-dark text-evaneos-beige"
                : "bg-white text-evaneos-dark border border-evaneos-dark/10"
              }
            `}
          >
            {msg.type === "text" && <TextResult content={msg.content} />}
            {msg.type === "chart" && (
                <div className="space-y-2">
                  <p>{msg.content}</p>
                  <DataChart />
                </div>
              )}
              {msg.type === "history" && (
                <div className="space-y-2">
                  <p>{msg.content}</p>
                  {/* Pass TEMPORARY history to HistoryList (no persistence) */}
                  <HistoryList tempHistory={tempChatHistory} />
                </div>
              )}
              {msg.type === "error" && (
                <ErrorTip message={msg.content} onRetry={() => alert("Retry triggered (temp history remains)")} />
              )}
              <div className={`
                mt-1 text-xs ${
                  msg.sender === "user" ? "text-blue-100" : "text-gray-400"
                } text-right
              `}>
                {msg.timestamp}
              </div>
          </div>
          {/* User avatar */}
          {msg.sender === "user" && (
            <div className="w-9 h-9 rounded-full bg-evaneos-panel flex items-center justify-center text-white font-semibold text-sm shadow">
              U
            </div>
          )}
        </div>
    ))}

    {/* Render loading indicator */}
    {isTyping && <LoadingIndicator isTyping={isTyping}  />}
    <div ref={bottomRef} /></div>

      {/* INPUT BAR – floating, soft, brand button */}
      <div className="px-6 py-4 bg-evaneos-beige border-t border-evaneos-dark/20">
        {/* Pass send callback to PromptList */}
        <PromptList onSendPrompt={handleSendMessage} />
        <InputBox onSend={handleSendMessage} />
      </div>
    </div>
  );
}
