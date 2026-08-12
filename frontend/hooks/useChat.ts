import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Message, LoadingStatus } from '../types';
import { sendChatMessage, syncKnowledgeBase } from '../services/api';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'assistant',
  content: 'Hello! I am the Cimba.AI support assistant. How can I help you today? Feel free to ask about our AI agents, data connectors, security, or workflows.',
  timestamp: Date.now(),
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [status, setStatus] = useState<LoadingStatus>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const sendMessage = useCallback(
    async (queryText: string) => {
      const trimmed = queryText.trim();
      if (!trimmed || status !== 'idle') return;

      setSearchTerm('');

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setStatus('sending');

      try {
        const data = await sendChatMessage(trimmed, messages);

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          context: data.context,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        console.error('Chat error:', error);
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: 'Could not retrieve a response. Please verify the backend server is running.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setStatus('idle');
      }
    },
    [messages, status]
  );

  const syncKnowledge = useCallback(async () => {
    if (status !== 'idle') return;

    setStatus('ingesting');
    try {
      const data = await syncKnowledgeBase();
      showToast(`Knowledge base synced successfully (${data.count} documents).`);
    } catch (error) {
      console.error('Sync error:', error);
      showToast('Failed to sync knowledge base. Check server logs.');
    } finally {
      setStatus('idle');
    }
  }, [status, showToast]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Started a new session. How can I help you with Cimba.AI today?',
        timestamp: Date.now(),
      },
    ]);
    setSearchTerm('');
  }, []);

  // Initial welcome query on first load
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      const timer = setTimeout(() => {
        sendMessage('What is Cimba.AI?');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sendMessage]);

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;
    const term = searchTerm.toLowerCase();
    return messages.filter(
      (m) =>
        m.content.toLowerCase().includes(term) ||
        m.context?.some((c) => c.toLowerCase().includes(term))
    );
  }, [messages, searchTerm]);

  return {
    messages: filteredMessages,
    rawMessages: messages,
    status,
    searchTerm,
    setSearchTerm,
    toast,
    sendMessage,
    syncKnowledge,
    resetChat,
  };
};
