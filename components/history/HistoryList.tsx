"use client";
import React from "react";

// Define temporary chat history type (no persistence)
interface TempHistoryItem {
  id: string;
  timestamp: string; // Format: "HH:MM"
  userMessage: string;
  botResponse: string;
}

// Props: Receive temporary history from parent (ChatContainer)
interface HistoryListProps {
  tempHistory: TempHistoryItem[]; // History is passed from parent (only in memory)
}

export default function HistoryList({ tempHistory }: HistoryListProps) {
  return (
    <div className="mt-2 p-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
      {/* Show empty state if no temporary history */}
      {tempHistory.length === 0 ? (
        <p className="text-sm text-gray-500">No recent chat history yet.</p>
      ) : (
        tempHistory.map((item) => (
          <div key={item.id} className="mb-3 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <div className="text-xs text-gray-400 mb-1">{item.timestamp}</div>
            <div className="text-sm font-medium text-gray-800">You: {item.userMessage}</div>
            <div className="text-sm text-gray-600">Bot: {item.botResponse}</div>
          </div>
        ))
      )}
    </div>
  );
}