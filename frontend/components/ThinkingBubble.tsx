import React from 'react';

export const ThinkingBubble: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 w-full animate-fade-in">
      <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-700 shadow-sm flex items-center">
        <div className="flex space-x-1.5">
          <div 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};