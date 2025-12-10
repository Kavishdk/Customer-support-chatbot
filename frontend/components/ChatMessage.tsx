import React, { useState } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isContextOpen, setIsContextOpen] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fullDateTime = new Date(message.timestamp).toLocaleString();

  if (isSystem) {
    return (
      <div className="flex flex-col items-center my-4 gap-1 animate-fade-in">
        <span className="bg-gray-800 text-gray-400 text-xs py-1 px-3 rounded-full border border-gray-700 shadow-sm">
          {message.content}
        </span>
        <span className="text-[10px] text-gray-600 select-none">
          {formatTime(message.timestamp)}
        </span>
      </div>
    );
  }

  const hasContext = message.context && message.context.length > 0;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in group`}>
      <div
        className={`max-w-[80%] lg:max-w-[70%] p-4 rounded-2xl transition-all relative ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-none shadow-sm'
        }`}
      >
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        
        {/* Context Accordion for Assistant Messages */}
        {hasContext && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <button
              onClick={() => setIsContextOpen(!isContextOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-3 w-3 transition-transform duration-200 ${isContextOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {isContextOpen ? 'Hide Retrieved Context' : 'Show Retrieved Context'}
            </button>
            
            {isContextOpen && (
              <div className="mt-2 space-y-2 animate-fade-in">
                {message.context?.map((ctx, idx) => (
                  <div key={idx} className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-700/50">
                    <p className="text-[11px] leading-relaxed text-gray-400 font-mono">
                      "{ctx}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div 
          className={`text-[10px] mt-2 opacity-60 flex justify-end ${isUser ? 'text-blue-200' : 'text-gray-400'}`}
          title={fullDateTime}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};