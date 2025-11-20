"use client";
import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 😊 I'm your Evaneos assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    // add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // fake bot reply for now
    const botReply =
      "I'm here to assist you! (This is a placeholder — will connect to backend later.)";

    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply },
      ]);
      setIsTyping(false);
    }, 800);


    setInput("");
  };
  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };


  return (
    <div className="flex flex-col h-screen bg-evaneos-beige text-evaneos-dark">

      {/* HEADER – using your evaneos colors */}
      <header className="flex items-center px-6 py-3 bg-evaneos-dark text-evaneos-beige shadow-md gap-4">
        <div className="bg-evaneos-panel px-3 py-1 rounded">
          <img src="/evaneos-logo.svg" alt="Evaneos logo" className="h-9" />
        </div>
        <span className="text-xl font-semibold tracking-wide">
          Internal Assistant
        </span>
      </header>

      {/* MESSAGES AREA – premium spacing & bubbles */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
       {messages.map((msg, i) => (
  <div key={i} className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>

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
        px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm
        max-w-[70%]
        ${msg.sender === "user"
          ? "bg-evaneos-dark text-evaneos-beige"
          : "bg-white text-evaneos-dark border border-evaneos-dark/10"
        }
      `}
    >
      {msg.text}
    </div>

    {/* User avatar */}
    {msg.sender === "user" && (
      <div className="w-9 h-9 rounded-full bg-evaneos-panel flex items-center justify-center text-white font-semibold text-sm shadow">
        U
      </div>
    )}

  </div>
))}


{isTyping && (
  <div className="self-start bg-white border border-evaneos-dark/10 px-4 py-3 rounded-2xl text-[15px] shadow-sm max-w-[60%] flex items-center gap-2">
    <span className="text-evaneos-dark">Assistant is typing</span>
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-evaneos-dark rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-evaneos-dark rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-evaneos-dark rounded-full animate-bounce delay-300"></span>
    </div>
  </div>
)}

<div ref={bottomRef} />

      </div>

      {/* INPUT BAR – floating, soft, brand button */}
      <div className="px-6 py-4 bg-evaneos-beige border-t border-evaneos-dark/20">
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md border border-evaneos-dark/10">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight(e.target);
            }}
            placeholder="Write your message…"
            rows={1}
            className="flex-1 bg-transparent outline-none text-evaneos-dark placeholder-evaneos-dark/40 resize-none overflow-hidden leading-normal"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />


          <button
            onClick={sendMessage}
            className="bg-evaneos-dark hover:bg-evaneos-panel text-evaneos-beige px-6 py-2 rounded-xl text-sm font-medium transition shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
