import React from 'react';
import { LoadingState } from '../types';

interface IngestButtonProps {
  onIngest: () => void;
  status: LoadingState;
}

export const IngestButton: React.FC<IngestButtonProps> = ({ onIngest, status }) => {
  const isLoading = status === LoadingState.INGESTING;

  return (
    <button
      onClick={onIngest}
      disabled={isLoading}
      className={`
        relative group overflow-hidden px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
        ${isLoading 
          ? 'bg-amber-900/50 text-amber-200 cursor-not-allowed' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
        }
      `}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
        <span>{isLoading ? 'Ingesting Knowledge...' : 'Reset & Ingest FAQs'}</span>
      </div>
    </button>
  );
};