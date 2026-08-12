import React from 'react';
import { SearchInput } from './SearchInput';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchTerm,
  onSearchChange,
  onNewChat,
}) => {
  return (
    <header className="h-14 border-b border-zinc-850 bg-zinc-950/80 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-900 transition-colors"
          title="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5 truncate">
          <span className="text-sm font-semibold text-zinc-200 truncate">
            Customer Support Bot
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <SearchInput value={searchTerm} onChange={onSearchChange} />

        <button
          onClick={onNewChat}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-md transition-colors"
          title="Start new conversation"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
};
