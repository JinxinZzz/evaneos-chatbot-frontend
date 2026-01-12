"use client";
import React from "react";

// Props: Receive send callback from ChatContainer
interface PromptListProps {
  onSendPrompt: (prompt: string) => void; // Callback to send prompt directly
}

export default function PromptList({ onSendPrompt }: PromptListProps): React.ReactElement {
  const prompts = [
    { id: "1", text: "TA1 Rate Spain 2025" },          
  { id: "2", text: "Average Basket France 2025" },    
  { id: "3", text: "Request Growth Italy 2024-2025" }, 
  { id: "4", text: "TA1 Rate + Basket Germany 2025" },
  { id: "5", text: "Request Growth France 2024 vs 2025" }
  ];

  const handlePromptClick = (prompt: string) => {
    if (prompt.trim()) onSendPrompt(prompt);
  };

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {prompts.map((p) => (
        <button
          key={p.id}
          onClick={() => handlePromptClick(p.text)}
          className="px-4 py-2 bg-evaneos-panel text-white text-sm rounded-full hover:bg-evaneos-dark transition-colors shadow-sm"
          aria-label={`Send prompt: ${p.text}`}
        >
          {p.text}
        </button>
      ))}
    </div>
  );
}