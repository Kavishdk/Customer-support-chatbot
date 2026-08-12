import React, { useRef, useEffect } from 'react';
import { Message, LoadingStatus } from '../types';
import { ChatMessage } from './ChatMessage';
import { ThinkingBubble } from './ThinkingBubble';

interface MessageListProps {
  messages: Message[];
  loadingStatus: LoadingStatus;
  searchTerm: string;
  onClearSearch: () => void;
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  'What is Cimba.AI?',
  'What integrations are supported?',
  'How does Cimba ensure data privacy?',
  'How do I create and trigger workflows?',
];

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loadingStatus,
  searchTerm,
  onClearSearch,
  onSelectPrompt,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchTerm) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingStatus, searchTerm]);

  return (
    <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-3xl mx-auto w-full">
        {messages.length === 0 && searchTerm ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 space-y-2">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-zinc-400">No messages match "{searchTerm}"</p>
            <button
              onClick={onClearSearch}
              className="text-xs text-brand-400 hover:text-brand-300 underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loadingStatus === 'sending' && !searchTerm && <ThinkingBubble />}
          </>
        )}

        {messages.length <= 2 && !searchTerm && (
          <div className="mt-8 pt-6 border-t border-zinc-800/60">
            <div className="text-xs text-zinc-500 font-medium mb-3">
              Suggested inquiries
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPrompt(prompt)}
                  disabled={loadingStatus !== 'idle'}
                  className="text-left p-2.5 rounded-lg bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700/80 text-xs text-zinc-300 hover:text-zinc-100 transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{prompt}</span>
                  <svg className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </main>
  );
};
