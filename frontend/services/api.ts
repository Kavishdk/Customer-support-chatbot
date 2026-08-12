import { ChatResponse, Message } from '../types';

const API_BASE = (import.meta as unknown as { env: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || '/api';

export const sendChatMessage = async (
  query: string,
  history: Message[]
): Promise<ChatResponse> => {
  const historyPayload = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));

  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      history: historyPayload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const syncKnowledgeBase = async (): Promise<{ count: number }> => {
  const response = await fetch(`${API_BASE}/ingest-docs`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Ingestion failed with status ${response.status}`);
  }

  return response.json();
};
