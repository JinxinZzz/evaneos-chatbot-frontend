"use client";
import React, { useState, ChangeEvent, KeyboardEvent } from "react";

interface InputBoxProps {
  onSend: (message: string) => void; // Callback to send message
  maxLength?: number;
}

export default function InputBox({ onSend, maxLength = 500 }: InputBoxProps): React.ReactElement {
  const [input, setInput] = useState("");

  // Handle textarea height adjustment
  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Handle input change & auto-resize
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > maxLength) return; // enforce max length
    setInput(e.target.value);
    adjustHeight(e.target);
  };

  // Handle Enter key: Shift+Enter => newline, Enter => send
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Trigger send action
  const sendMessage = () => {
    const trimmed = input.replace(/\s+/g, ' ').trim();
    if (trimmed) {
      onSend(trimmed);
      setInput("");
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md border border-evaneos-dark/10">
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Write your message…"
        rows={1}
        className="flex-1 bg-transparent outline-none text-evaneos-dark placeholder-evaneos-dark/40 resize-none overflow-hidden leading-normal"
      />
      <button
        onClick={sendMessage}
        className="bg-evaneos-dark hover:bg-evaneos-panel text-evaneos-beige px-6 py-2 rounded-xl text-sm font-medium transition shadow"
      >
        Send
      </button>
    </div>
  );
}