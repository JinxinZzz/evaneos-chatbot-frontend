// src/utils/api.ts
// Simulated API utilities for Evaneos Chatbot frontend
// All functions return Promise-resolved values matching types in src/types/api.types.ts
// Comments in Chinese to help frontend developers replace with real requests later.

import {
  ChatRequest,
  ChatResponse,
  ChartData,
  HistoryRequest,
  HistoryResponse,
  ExportChartRequest,
  ExportChartResponse,
  PromptsResponse,
  PromptItem,
  HistoryItem,
} from '../types/api.types';

// Helper: format Date to 'DD/MM/YYYY HH:mm:ss' using en-GB locale and remove commas
function formatTimestamp(date: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const s = date.toLocaleString('en-GB', opts);
  return s.replace(/,/g, '').replace(/\s+/g, ' ');
}

// Simulate network delay helper (保留，模拟真实网络延迟)
function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Environment-driven mock toggle (MSW 模式下强制为 true，后续可通过环境变量切换)
const isMock = typeof process !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_MOCK !== 'false') 
  : true;

/**
 * 核心修改：将原有的纯函数模拟改为 fetch 调用（对接 MSW 路由）
 * 这样 Safari Network 面板能捕获到真实的网络请求
 */

/**
 * sendChatMessage
 * 调用 POST /api/chat (MSW 拦截该请求并返回模拟数据)
 * - returns ChatResponse matching types
 * - 3 possible response types determined by input content
 */
export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
        console.log('sendChatMessage', req.input);

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });

    const data = await response.json();
    console.log('response', data);

    return data;
 
    if (!isMock) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return response.json();
  }

  // 降级模拟逻辑（无 MSW 时备用）
  const now = formatTimestamp(new Date());
  const inputLower = req.input.trim().toLowerCase();
  
  if (inputLower.includes('chart') || inputLower.includes('sales') || inputLower.includes('graph')) {
    const data: ChartData = {
      labels: ['Jan', 'Feb', 'Mar'],
      values: [120, 150, 130],
      colors: ['#4F46E5', '#10B981', '#F59E0B'],
      unit: 'EUR',
    };
    return delay(1200, { type: 'chart', message: 'Generated chart for your query.', data, timestamp: now });
  }
  
  if (inputLower.includes('history') || inputLower.includes('past')) {
    const historyItems: HistoryItem[] = [
      { sessionId: req.sessionId, message: 'Hello', sender: 'user', timestamp: now },
      { sessionId: req.sessionId, message: 'Welcome back', sender: 'bot', timestamp: now },
    ];
    return delay(1200, { type: 'history', message: 'Requested history', data: { history: historyItems }, timestamp: now });
  }
  
  if (inputLower.includes('error') || inputLower === '') {
    return delay(1200, { type: 'error', message: 'Failed to process input', error: 'Simulated processing error', timestamp: now });
  }
  
  return delay(1200, { type: 'text', message: `Echo: ${req.input}`, timestamp: now });
}

/**
 * getChatHistory
 * 调用 GET /api/chat/history (MSW 拦截该请求并返回模拟数据)
 */
export async function getChatHistory(req?: HistoryRequest): Promise<HistoryResponse> {
  // 真实 fetch 请求（MSW 会拦截）
  if (!isMock) {
    const params = req ? new URLSearchParams(req as Record<string, string>) : '';
    const url = `/api/chat/history${params ? `?${params}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  // 降级模拟逻辑
  const now = formatTimestamp(new Date());
  const items: HistoryItem[] = [];
  const count = req?.limit ?? 5;
  
  for (let i = 0; i < count; i++) {
    items.push({
      sessionId: req?.sessionId ?? `session-${Date.now() - i * 1000}`,
      message: `Sample message ${i + 1}`,
      sender: i % 2 === 0 ? 'user' : 'bot',
      timestamp: now,
    });
  }
  
  return delay(800, { items });
}

/**
 * exportChart
 * 调用 POST /api/export/chart (MSW 拦截该请求并返回模拟数据)
 */
export async function exportChart(req: ExportChartRequest): Promise<ExportChartResponse> {
  // 真实 fetch 请求（MSW 会拦截）
  if (!isMock) {
    const response = await fetch('/api/export/chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return response.json();
  }

  // 降级模拟逻辑
  const now = formatTimestamp(new Date());
  const fileName = req.chartId ?? `chart-${Date.now()}`;
  const ext = req.format;
  const url = `https://example.com/downloads/${fileName}.${ext}`;
  
  return delay(1000, { url, expiresAt: now });
}

/**
 * getPrompts
 * 调用 GET /api/prompts (MSW 拦截该请求并返回模拟数据)
 */
export async function getPrompts(): Promise<PromptsResponse> {
  // 真实 fetch 请求（MSW 会拦截）
  if (!isMock) {
    const response = await fetch('/api/prompts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  // 降级模拟逻辑
  const prompts: PromptItem[] = [
    { id: 'p1', text: 'Show latest sales by region', description: 'Quick chart for sales' },
    { id: 'p2', text: 'Compare 2024 vs 2025', description: 'Comparison overview' },
    { id: 'p3', text: 'Top 10 destinations', description: 'List top destinations' },
  ];
  
  return delay(500, { prompts });
}

const api = {
  sendChatMessage,
  getChatHistory,
  exportChart,
  getPrompts,
};

export default api;