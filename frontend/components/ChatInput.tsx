import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  isSearching: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, isSearching }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && !isSearching) {
      inputRef.current?.focus();
    }
  }, [disabled, isSearching]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled || isSearching) return;
    setValue('');
    onSend(text);
  };

  return (
    <footer className="p-4 md:px-6 md:pb-6 pt-2 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent shrink-0">
      <div className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700 transition-all shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                isSearching
                  ? 'Clear message filter to ask...'
                  : 'Ask about Cimba.AI platform, APIs, workflows...'
              }
              className="flex-1 bg-transparent px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none disabled:opacity-50"
              disabled={disabled || isSearching}
            />

            <button
              type="submit"
              disabled={!value.trim() || disabled || isSearching}
              className={`p-2 rounded-lg transition-all ${
                value.trim() && !disabled && !isSearching
                  ? 'bg-zinc-100 text-zinc-950 hover:bg-white active:scale-95 shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed'
              }`}
              title="Send message (Enter)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between px-2 mt-2 text-[11px] text-zinc-500">
            <span>Cimba Support Assistant</span>
            <span className="hidden sm:inline">Press Enter ↵ to send</span>
          </div>
        </form>
      </div>
    </footer>
  );
};
