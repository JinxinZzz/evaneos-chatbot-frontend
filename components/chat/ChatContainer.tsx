"use client";
import React, { useEffect, useRef, useState } from 'react';
import { worker } from '../../mocks/setup'; // MSW 导入
import InputBox from './InputBox';
import PromptList from './PromptList';
import LoadingIndicator from './LoadingIndicator';
import HistoryList from '../history/HistoryList';
import DataChart from '../result/DataChart';
import ErrorTip from '../result/ErrorTip';
import TextResult from '../result/TextResult';
import api from '../../src/utils/api';
import type { ChatResponse, HistoryItem } from '../../src/types/api.types';
import Image from 'next/image';

type ChatMessage = {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  type?: 'text' | 'chart' | 'history' | 'error';
  timestamp: string;
};

type TempHistoryItem = {
  id: string;
  timestamp: string;
  userMessage: string;
  botResponse: string;
};

const formatNow = (): string => '';

const getClientTimestamp = (): string =>
  new Date()
    .toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/,/g, '')
    .replace(/\s+/g, ' ');

export default function ChatContainer(): React.ReactElement {
  const [tempChatHistory, setTempChatHistory] = useState<TempHistoryItem[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([
    {
      id: 'init-001',
      sender: 'bot',
      content: "Hello 😊 I'm your Evaneos assistant. How can I help you today?\nTry 'show chart', 'history', or type a message.",
      type: 'text',
      timestamp: '', 
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (process.env.NODE_ENV === 'development' && worker) {
    worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js' // 指向 public 下的脚本
      },
      onUnhandledRequest: 'bypass'
    }).then(() => {
      console.log('MSW service worker started ✅');
    }).catch(err => {
      console.error('MSW service worker failed ❌:', err);
    });
  }
}, []);

  useEffect(() => {
    const clientTime = getClientTimestamp();
    setCurrentMessages(prev => 
      prev.map(msg => 
        msg.id === 'init-001' ? { ...msg, timestamp: clientTime } : msg
      )
    );
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const hist = await api.getChatHistory();
        if (!mounted) return;
        const mapped = hist.items.map((h, i) => ({ 
          id: `h-${i}-${Date.now()}`, 
          timestamp: h.timestamp, 
          userMessage: h.sender === 'user' ? h.message : '', 
          botResponse: h.sender === 'bot' ? h.message : '' 
        }));
        setTempChatHistory(mapped);
      } catch (err) {
        console.warn('加载历史记录失败（演示模式）:', err);
      }
      try {
        await api.getPrompts();
      } catch (err) {
        console.warn('加载提示词失败（演示模式）:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.replace(/\s+/g, ' ').trim();
    if (!trimmed) return;
    if (trimmed.length > 500) {
      alert('Message too long. Maximum 500 characters allowed.');
      return;
    }

    const clientTime = getClientTimestamp();
    const userMsg: ChatMessage = { 
      id: `user-${Date.now()}`, 
      sender: 'user', 
      content: trimmed, 
      type: 'text', 
      timestamp: clientTime 
    };
    setCurrentMessages((p) => [...p, userMsg]);
    setIsTyping(true);

    const timeoutMs = 10000;
    let didTimeout = false;
    const t = setTimeout(() => {
      didTimeout = true;
      setIsTyping(false);
      const timeoutTime = getClientTimestamp();
      setCurrentMessages((p) => [...p, { 
        id: `bot-timeout-${Date.now()}`, 
        sender: 'bot', 
        content: 'Request timed out.', 
        type: 'error', 
        timestamp: timeoutTime 
      }]);
    }, timeoutMs);

    try {
      const resp: ChatResponse = await api.sendChatMessage({ 
        input: trimmed, 
        sessionId: `session-${Date.now()}` 
      });
      if (didTimeout) return;

      switch (resp.type) {
        case 'text':
          setCurrentMessages((p) => [...p, { 
            id: `bot-text-${Date.now()}`, 
            sender: 'bot', 
            content: resp.message, 
            type: 'text', 
            timestamp: resp.timestamp 
          }]);
          break;
        case 'chart':
          setCurrentMessages((p) => [...p, { 
            id: `bot-chart-${Date.now()}`, 
            sender: 'bot', 
            content: resp.message, 
            type: 'chart', 
            timestamp: resp.timestamp 
          }]);
          break;
        case 'history': {
          const historyData = (resp.data && (resp.data as { history?: HistoryItem[] }).history) || [];
          const mapped = historyData.map((h, i) => ({ 
            id: `h-${Date.now()}-${i}`, 
            timestamp: h.timestamp, 
            userMessage: h.sender === 'user' ? h.message : '', 
            botResponse: h.sender === 'bot' ? h.message : '' 
          }));
          setTempChatHistory((p) => [...p, ...mapped]);
          setCurrentMessages((p) => [...p, { 
            id: `bot-history-${Date.now()}`, 
            sender: 'bot', 
            content: resp.message, 
            type: 'history', 
            timestamp: resp.timestamp 
          }]);
          break;
        }
        case 'error':
          setCurrentMessages((p) => [...p, { 
            id: `bot-error-${Date.now()}`, 
            sender: 'bot', 
            content: resp.message, 
            type: 'error', 
            timestamp: resp.timestamp 
          }]);
          break;
        default:
          setCurrentMessages((p) => [...p, { 
            id: `bot-unknown-${Date.now()}`, 
            sender: 'bot', 
            content: resp.message || 'Unknown response', 
            type: 'text', 
            timestamp: resp.timestamp 
          }]);
      }
    } catch (err) {
      if (!didTimeout) {
        const errorTime = getClientTimestamp();
        setCurrentMessages((p) => [...p, { 
          id: `bot-err-${Date.now()}`, 
          sender: 'bot', 
          content: 'Request error occurred.', 
          type: 'error', 
          timestamp: errorTime 
        }]);
      }
    } finally {
      clearTimeout(t);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-evaneos-beige text-evaneos-dark">
      <header className="flex items-center px-6 py-3 bg-evaneos-dark text-evaneos-beige shadow-md gap-4">
        <div className="bg-evaneos-panel px-3 py-1 rounded">
          <Image src="/evaneos-logo.svg" alt="Evaneos logo" width={36} height={36} className="h-9" />
        </div>
        <span className="text-xl font-semibold tracking-wide">Internal Assistant</span>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {currentMessages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 relative rounded-full overflow-hidden border border-evaneos-dark/20">
                <Image src="/evaneos-icon.jpeg" alt="Bot Avatar" fill style={{ objectFit: 'cover' }} />
              </div>
            )}

            <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm max-w-[70%] ${msg.sender === 'user' ? 'bg-evaneos-dark text-evaneos-beige' : 'bg-white text-evaneos-dark border border-evaneos-dark/10'}`}>
              {msg.type === 'text' && <TextResult content={msg.content} />}
              {msg.type === 'chart' && (
                <div className="space-y-2">
                  <p>{msg.content}</p>
                  <DataChart />
                </div>
              )}
              {msg.type === 'history' && (
                <div className="space-y-2">
                  <p>{msg.content}</p>
                  <HistoryList tempHistory={tempChatHistory} />
                </div>
              )}
              {msg.type === 'error' && <ErrorTip message={msg.content} onRetry={() => sendMessage(msg.content)} />}
              <div className={`mt-1 text-xs ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'} text-right`}>{msg.timestamp}</div>
            </div>

            {msg.sender === 'user' && <div className="w-9 h-9 rounded-full bg-evaneos-panel flex items-center justify-center text-white font-semibold text-sm shadow">U</div>}
          </div>
        ))}

        {isTyping && <LoadingIndicator isTyping={isTyping} />}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 bg-evaneos-beige border-t border-evaneos-dark/20">
        <PromptList onSendPrompt={sendMessage} />
        <InputBox onSend={sendMessage} maxLength={500} />
      </div>
    </div>
  );
}