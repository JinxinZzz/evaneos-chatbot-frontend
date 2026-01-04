// src/types/api.types.ts
// Type definitions for Evaneos Chatbot frontend <-> backend API
// All interfaces use explicit optional (?) markers where fields may be omitted.

/**
 * ChatRequest
 * - input: user input text (required)
 * - sessionId: session identifier in format `session-<timestamp>` (required)
 */
export interface ChatRequest {
  /** User input text (required) */
  input: string;
  /** Session identifier, e.g. "session-1672531200000" (required) */
  sessionId: string;
}

/**
 * ChartData
 * Structure used when response type is 'chart'
 */
export interface ChartData {
  /** Labels for the chart, e.g. ['Jan', 'Feb'] */
  labels: string[];
  /** Numeric values matched to labels */
  values: number[];
  /** Optional colors per label */
  colors?: string[];
  /** Optional unit string, e.g. 'USD', '%' */
  unit?: string;
}

/**
 * HistoryItem
 * Represents a single history entry
 */
export interface HistoryItem {
  sessionId: string;
  message: string;
  sender: 'user' | 'bot';
  /** Timestamp in format DD/MM/YYYY HH:mm:ss */
  timestamp: string;
}

/**
 * ChatResponse
 * - type: 'text' | 'chart' | 'history' | 'error' (required)
 * - message: text message (required)
 * - data: optional object, structure depends on `type`
 * - timestamp: string in DD/MM/YYYY HH:mm:ss (required)
 * - error: optional error message when type === 'error'
 */
export interface ChatResponse {
  type: 'text' | 'chart' | 'history' | 'error';
  message: string;
  data?: ChartData | { history: HistoryItem[] } | Record<string, unknown>;
  timestamp: string;
  error?: string;
}

/**
 * HistoryRequest
 * Optional filters for history queries
 */
export interface HistoryRequest {
  sessionId?: string;
  limit?: number;
}

/**
 * HistoryResponse
 */
export interface HistoryResponse {
  items: HistoryItem[];
}

/**
 * ExportChartRequest / ExportChartResponse
 */
export interface ExportChartRequest {
  chartId?: string;
  data?: ChartData;
  format: 'pdf' | 'csv' | 'png';
}

export interface ExportChartResponse {
  url: string;
  expiresAt?: string;
}

/**
 * PromptsResponse
 */
export interface PromptItem {
  id: string;
  text: string;
  description?: string;
}

export interface PromptsResponse {
  prompts: PromptItem[];
}
