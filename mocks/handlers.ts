import { http, HttpResponse } from 'msw';
import type { ChatRequest, ChatResponse, HistoryItem } from '../src/types/api.types';

const formatTimestamp = (): string => {
  return new Date()
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
};

export const handlers = [
  http.post('/api/chat', async ({ request }) => {
    const body = await request.json() as ChatRequest;
    const timestamp = formatTimestamp(); 
    
    let response: ChatResponse;
    if (body.input.toLowerCase().includes('chart') || body.input.includes('show chart')) {
      response = {
        type: 'chart',
        message: '2025 Quarterly Sales Performance',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          values: [120, 190, 250, 300],
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          unit: 'K USD'
        },
        timestamp: timestamp
      };
    } else if (body.input.includes('error')) {
      response = {
        type: 'error',
        message: 'Failed to retrieve data. Please try again later.',
        error: 'Simulated database error',
        timestamp: timestamp
      };
    } else if (body.input.includes('history')) {
      const historyItems: HistoryItem[] = [
        {
          sessionId: body.sessionId,
          message: 'Hello from history',
          sender: 'user',
          timestamp: timestamp
        },
        {
          sessionId: body.sessionId,
          message: 'Welcome back!',
          sender: 'bot',
          timestamp: timestamp
        }
      ];
      response = {
        type: 'history',
        message: 'Requested chat history',
        data: { history: historyItems },
        timestamp: timestamp
      };
    } else {
      response = {
        type: 'text',
        message: `Echo: ${body.input}`,
        timestamp: timestamp
      };
    }

    await new Promise(resolve => setTimeout(resolve, 1200));
    return HttpResponse.json(response);
  }),

  http.get('/api/prompts', () => {
    return HttpResponse.json({
      prompts: [
        { id: 'p1', text: 'Show latest sales by region', description: 'Quick chart for sales' },
        { id: 'p2', text: 'Compare 2024 vs 2025', description: 'Comparison overview' },
        { id: 'p3', text: 'Top 10 destinations', description: 'List top destinations' }
      ]
    });
  }),

  http.get('/api/chat/history', () => {
    const timestamp = formatTimestamp();
    return HttpResponse.json({
      items: [ 
        {
          sessionId: `session-${Date.now()}`,
          message: 'First sample message',
          sender: 'user', 
          timestamp: timestamp
        },
        {
          sessionId: `session-${Date.now()}`,
          message: 'Response to first message',
          sender: 'bot',
          timestamp: timestamp
        },
        {
          sessionId: `session-${Date.now()}`,
          message: 'Second sample message',
          sender: 'user',
          timestamp: timestamp
        }
      ]
    });
  })
];