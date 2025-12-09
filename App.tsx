import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Message, LoadingState, ChatResponse } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ThinkingBubble } from './components/ThinkingBubble';
import { SearchInput } from './components/SearchInput';

// Use relative path to leverage Vite's proxy (defined in vite.config.ts)
// This forwards /api requests to http://localhost:5000/api
const API_URL = '/api';

/**
 * Main Application Component
 * 
 * Responsibilities:
 * 1. Manages chat history state.
 * 2. Handles user interactions (sending messages, clearing chat, searching).
 * 3. Communicates with the backend RAG API.
 * 4. Renders the Chat UI layout.
 */
const App: React.FC = () => {
  // --- State Management ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI Support Assistant.',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  // Refs for scrolling and initialization
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  /**
   * Helper: Auto-scroll to the bottom of the chat
   * We only scroll if the user isn't actively searching history.
   */
  const scrollToBottom = () => {
    if (!searchTerm) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status, searchTerm]);

  /**
   * Memoized: Filter messages based on search term
   * Allows users to instantly find past information in the chat.
   */
  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;

    const lowerTerm = searchTerm.toLowerCase();
    return messages.filter(msg =>
      msg.content.toLowerCase().includes(lowerTerm) ||
      msg.context?.some(ctx => ctx.toLowerCase().includes(lowerTerm))
    );
  }, [messages, searchTerm]);

  /**
   * Action: Send User Query to Backend
   * This is the core RAG interaction loop.
   */
  const handleQuery = useCallback(async (queryText: string) => {
    // Prevent double-sending or interruption
    if (status !== LoadingState.IDLE) return;

    // Clear search so the user sees the new meesage
    setSearchTerm('');

    // 1. Add User Message to UI immediately (Optimistic UI)
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus(LoadingState.SENDING);

    try {
      // 2. Call the RAG Backend
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      })).filter(m => m.role !== 'system'); // Exclude system error messages

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          history: historyPayload
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data: ChatResponse = await response.json();

      // 3. Add Bot Response to UI
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        context: data.context, // Debug context (visible on hover/inspect if implemented)
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Error: Could not connect to the backend. Please ensure the server (server.ts) is running on port 5000 and MongoDB is connected.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setStatus(LoadingState.IDLE);
    }
  }, [status]);

  // Auto-send welcome query on load
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      timeoutId = setTimeout(() => {
        handleQuery('What is Cimba.AI?');
      }, 500);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleQuery(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gray-900 shadow-2xl overflow-hidden">
      {/* --- HEADER --- */}
      <header className="flex-none p-4 md:p-6 border-b border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-900/95 backdrop-blur z-10">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Gemini RAG</h1>
            <p className="text-xs text-gray-400 font-medium hidden sm:block">MongoDB Vector Search</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header>

      {/* --- CHAT AREA --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide space-y-2">
        {filteredMessages.length === 0 && searchTerm ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 opacity-75">
            <p>No messages found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {/* Thinking Bubble */}
        {status === LoadingState.SENDING && !searchTerm && <ThinkingBubble />}
        <div ref={messagesEndRef} />
      </main>

      {/* --- INPUT FOOTER --- */}
      <footer className="flex-none p-4 md:p-6 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={searchTerm ? "Clear search to send message..." : "Ask about Cimba.AI..."}
            className={`w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner
                ${searchTerm ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={status !== LoadingState.IDLE || searchTerm.length > 0}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || status !== LoadingState.IDLE || searchTerm.length > 0}
            className={`
              absolute right-3 p-2 rounded-lg transition-all duration-200
              ${inputValue.trim() && !searchTerm
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-105'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;