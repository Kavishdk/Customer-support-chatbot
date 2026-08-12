import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in bg-zinc-900 border border-zinc-750 text-zinc-200 text-xs px-3.5 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-brand-400"></span>
      <span>{message}</span>
    </div>
  );
};
