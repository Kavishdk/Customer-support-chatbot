import React, { useState } from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-amber-900/40 text-amber-300 text-xs shadow-sm">
          <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-5 animate-fade-in group">
        <div className="max-w-[85%] md:max-w-[70%]">
          <div className="bg-zinc-800 text-zinc-100 border border-zinc-700/70 px-4 py-3 rounded-2xl rounded-tr-sm text-sm md:text-[15px] leading-relaxed shadow-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex justify-end items-center gap-1.5 mt-1 px-1 text-[11px] text-zinc-500 font-mono">
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  const hasContext = message.context && message.context.length > 0;

  return (
    <div className="flex gap-3.5 mb-6 animate-fade-in group">
      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300 shadow-sm">
        <svg className="w-4 h-4 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-200">Cimba Support</span>
            <span className="text-[11px] text-zinc-500 font-mono">{formatTime(message.timestamp)}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition-colors text-xs flex items-center gap-1"
              title="Copy message"
            >
              {copied ? (
                <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="text-zinc-200 text-sm md:text-[15px] leading-relaxed">
          <MarkdownRenderer content={message.content} />
        </div>

        {hasContext && (
          <div className="mt-3.5 pt-2">
            <button
              onClick={() => setIsContextOpen(!isContextOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-md transition-all"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-3 w-3 transition-transform duration-150 ${isContextOpen ? 'rotate-90 text-brand-400' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Retrieved Sources ({message.context?.length})</span>
            </button>

            {isContextOpen && (
              <div className="mt-2.5 space-y-2 animate-fade-in pl-1">
                {message.context?.map((ctx, idx) => (
                  <div key={idx} className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/90 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono mb-1.5 pb-1 border-b border-zinc-800/60">
                      <span className="font-semibold text-zinc-400">Source #{idx + 1}</span>
                      <span className="text-[10px] text-brand-400/80">Vector Match</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {ctx}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};