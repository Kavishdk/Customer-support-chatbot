import React from 'react';

interface ClearHistoryButtonProps {
  onClear: () => void;
  disabled?: boolean;
}

export const ClearHistoryButton: React.FC<ClearHistoryButtonProps> = ({ onClear, disabled }) => {
  return (
    <button
      onClick={onClear}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${disabled
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600'
        }
      `}
      title="Clear Conversation History"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
      <span className="hidden sm:inline">Clear</span>
    </button>
  );
};