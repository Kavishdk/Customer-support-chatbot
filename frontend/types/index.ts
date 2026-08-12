export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  context?: string[];
}

export interface ChatResponse {
  answer: string;
  context?: string[];
}

export type LoadingStatus = 'idle' | 'sending' | 'ingesting';
