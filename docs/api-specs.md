# Evaneos Chatbot API Specifications

## Document Notes

- This document defines the frontend-backend API contract for the Evaneos Chatbot project.
- Language: English. Time format: DD/MM/YYYY HH:mm:ss.
- All endpoints use JSON (UTF-8). Standard HTTP status codes: 200 (OK), 400 (Bad Request), 500 (Server Error).

## Core Endpoint

### POST /api/chat

Purpose: Send a chat input from the frontend to the backend and receive a typed response (text, chart, history, or error).

Request:

- Method: POST
- Path: /api/chat
- Body (application/json):

  - input: string (required) — user input text
  - sessionId: string (required) — session identifier, format `session-<timestamp>`

Example Request Body:

```json
{
  "input": "Show me sales for Q4",
  "sessionId": "session-1672531200000"
}
```

Response (200 OK):

Common fields:

- type: "text" | "chart" | "history" | "error"
- message: string
- data: object (optional; structure depends on type)
- timestamp: string (DD/MM/YYYY HH:mm:ss)
- error: string (optional, present when type === "error")

Example: Text Response

```json
{
  "type": "text",
  "message": "Here is the summary for Q4 sales.",
  "timestamp": "08/12/2025 10:30:00"
}
```

Example: Chart Response

```json
{
  "type": "chart",
  "message": "Q4 sales chart",
  "data": {
    "labels": ["Oct","Nov","Dec"],
    "values": [12000,15000,13000],
    "colors": ["#4F46E5","#10B981","#F59E0B"],
    "unit": "EUR"
  },
  "timestamp": "08/12/2025 10:30:00"
}
```

Example: Error Response

```json
{
  "type": "error",
  "message": "Failed to process the request",
  "error": "Invalid sessionId format",
  "timestamp": "08/12/2025 10:30:00"
}
```

## Supplementary Endpoints

### GET /api/chat/history

Purpose: Retrieve chat history for a session or global recent history.

Request:

- Method: GET
- Path: /api/chat/history
- Query parameters:
  - sessionId?: string (optional) — filter by session
  - limit?: number (optional) — maximum items to return

Example Request:

GET /api/chat/history?sessionId=session-1672531200000&limit=20

Response (200 OK):

```json
{
  "items": [
    {
      "sessionId": "session-1672531200000",
      "message": "Hello",
      "sender": "user",
      "timestamp": "07/12/2025 09:00:00"
    },
    {
      "sessionId": "session-1672531200000",
      "message": "Hi, how can I help?",
      "sender": "bot",
      "timestamp": "07/12/2025 09:00:01"
    }
  ]
}
```

### POST /api/export/chart

Purpose: Export a chart in the requested format and receive a download link.

Request:

- Method: POST
- Path: /api/export/chart
- Body (application/json):
  - chartId?: string (optional) — existing chart identifier
  - data?: object (optional) — Chart data if no chartId
  - format: string (required) — one of "pdf", "csv", "png"

Example Request Body:

```json
{
  "chartId": "sales-q4",
  "format": "pdf"
}
```

Response (200 OK):

```json
{
  "url": "https://example.com/downloads/sales-q4.pdf",
  "expiresAt": "09/12/2025 12:00:00"
}
```

### GET /api/prompts

Purpose: Retrieve dynamic Prompt suggestions.

Request:

- Method: GET
- Path: /api/prompts

Response (200 OK):

```json
{
  "prompts": [
    { "id": "p1", "text": "Show latest sales by region", "description": "Quick chart for sales" },
    { "id": "p2", "text": "Compare 2024 vs 2025", "description": "Comparison overview" }
  ]
}
```

## Conventions

- All endpoints exchange JSON encoded in UTF-8.
- Standard HTTP status codes: 200 (success), 400 (client error), 500 (server error).
- All timestamps use the format DD/MM/YYYY HH:mm:ss (e.g., 08/12/2025 10:30:00).
