import React from 'react';
import { LoadingStatus } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectTopic: (topic: string) => void;
  onIngestDocs: () => void;
  loadingStatus: LoadingStatus;
}

const FAQ_TOPICS = [
  { title: 'What is Cimba.AI?', desc: 'Core platform & capabilities' },
  { title: 'What integrations are supported?', desc: 'Data sources & connectors' },
  { title: 'How does Cimba handle data security?', desc: 'Compliance & privacy' },
  { title: 'How do I deploy an AI agent?', desc: 'Agent setup & workflows' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectTopic,
  onIngestDocs,
  loadingStatus,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold tracking-tight text-zinc-100 block">Cimba Support</span>
                <span className="text-[11px] text-zinc-500 block">Help Center</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-900"
              title="Close sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Conversation</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-800 rounded">
              Esc
            </kbd>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-1">
              FAQ Topics
            </div>
            <div className="space-y-1">
              {FAQ_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectTopic(topic.title);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-md transition-colors text-xs flex flex-col gap-0.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                >
                  <span className="font-medium truncate">{topic.title}</span>
                  <span className="text-[10px] text-zinc-500 truncate">{topic.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 space-y-3">
          <button
            onClick={onIngestDocs}
            disabled={loadingStatus === 'ingesting'}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-md transition-colors disabled:opacity-50"
            title="Re-embed and index FAQ documents"
          >
            <svg
              className={`w-3.5 h-3.5 text-zinc-400 ${loadingStatus === 'ingesting' ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loadingStatus === 'ingesting' ? 'Syncing FAQs...' : 'Sync Knowledge Base'}</span>
          </button>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-medium text-zinc-300">
              U
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-zinc-300 truncate">Support Workspace</span>
              <span className="text-[10px] text-zinc-500 truncate">Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
