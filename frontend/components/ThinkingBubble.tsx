import React from 'react';

export const ThinkingBubble: React.FC = () => {
  return (
    <div className="flex gap-3.5 mb-6 animate-fade-in">
      {/* Bot Avatar */}
      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0 mt-0.5 text-brand-400 shadow-sm">
        <svg className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </div>

      {/* Thinking message */}
      <div className="flex items-center gap-2.5 py-1">
        <span className="text-xs text-zinc-400 font-medium">
          Retrieving context & generating response
        </span>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
};