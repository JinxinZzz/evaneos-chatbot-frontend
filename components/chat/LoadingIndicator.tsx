"use client";
import React from "react";

interface LoadingIndicatorProps {
  isTyping: boolean; // Whether bot is typing
}

export default function LoadingIndicator({ isTyping }: LoadingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <div className="self-start bg-white border border-evaneos-dark/10 px-4 py-3 rounded-2xl text-[15px] shadow-sm max-w-[60%] flex items-center gap-2">
      <span className="text-evaneos-dark">Assistant is typing</span>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-evaneos-dark rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-evaneos-dark rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-evaneos-dark rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
}