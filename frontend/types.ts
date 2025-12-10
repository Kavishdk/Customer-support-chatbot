export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  context?: string[];
}

export interface ChatResponse {
  answer: string;
  context?: string[]; // Debugging: see what documents were retrieved
}

export enum LoadingState {
  IDLE = 'IDLE',
  SENDING = 'SENDING',
  INGESTING = 'INGESTING',
  ERROR = 'ERROR'
}

// Backend specific types (shared for reference)
export interface FAQDocument {
  content: string;
  category: string;
  embedding: number[];
}