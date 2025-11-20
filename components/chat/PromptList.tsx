"use client";
import React from "react";

// Props: Receive send callback from ChatContainer
interface PromptListProps {
  onSendPrompt: (prompt: string) => void; // Callback to send prompt directly
}

// Common prompts (extend as needed)
const COMMON_PROMPTS = [
  "Show me sales data for Q3",
  "List upcoming marketing campaigns",
  "Help me create a customer report",
  "Display 2025 quarterly sales chart"
];

export default function PromptList({ onSendPrompt }: PromptListProps) {
  // Handle prompt click: Send directly without hover
  const handlePromptClick = (prompt: string) => {
    if (prompt.trim()) {
      onSendPrompt(prompt); // Trigger send logic in parent
    }
  };

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {COMMON_PROMPTS.map((prompt, index) => (
        <button
          key={index}
          onClick={() => handlePromptClick(prompt)}
          className="px-4 py-2 bg-evaneos-panel text-evaneos-dark text-sm rounded-full hover:bg-evaneos-dark hover:text-white transition-colors shadow-sm"
          aria-label={`Send prompt: ${prompt}`}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}