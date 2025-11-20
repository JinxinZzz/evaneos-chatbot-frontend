"use client";
import React from "react";

// Props for error tip component
interface ErrorTipProps {
  message: string; // Error message to display
  onRetry?: () => void; // Optional retry callback
}

export default function ErrorTip({ message, onRetry }: ErrorTipProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-2">
        {/* Error icon */}
        <svg
          className="w-5 h-5 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        
        {/* Error message and action */}
        <div>
          <p className="text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}