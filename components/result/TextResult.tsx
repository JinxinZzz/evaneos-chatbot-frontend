"use client";
import React from "react";

// Props for text result component
interface TextResultProps {
  content: string; // Text content to display
  title?: string; // Optional title
}

export default function TextResult({ content, title }: TextResultProps) {
  return (
    <div className="p-4 border rounded-lg">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="prose max-w-none">
        {content.split("\n").map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>
    </div>
  );
}