"use client";
import React, { useEffect, useState } from "react";
import api from '../../src/utils/api';

// Props: Receive send callback from ChatContainer
interface PromptListProps {
  onSendPrompt: (prompt: string) => void; // Callback to send prompt directly
}

export default function PromptList({ onSendPrompt }: PromptListProps): React.ReactElement {
  const [prompts, setPrompts] = useState<{ id: string; text: string; description?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.getPrompts();
        if (mounted) setPrompts(res.prompts);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handlePromptClick = (prompt: string) => {
    if (prompt.trim()) onSendPrompt(prompt);
  };

  if (loading) return <div className="mb-3 text-sm text-gray-500">Loading prompts...</div>;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {prompts.map((p) => (
        <button
          key={p.id}
          onClick={() => handlePromptClick(p.text)}
          className="px-4 py-2 bg-evaneos-panel text-evaneos-dark text-sm rounded-full hover:bg-evaneos-dark hover:text-white transition-colors shadow-sm"
          aria-label={`Send prompt: ${p.text}`}
        >
          {p.text}
        </button>
      ))}
    </div>
  );
}