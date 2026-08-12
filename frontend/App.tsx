import React, { useState } from 'react';
import { useChat } from './hooks/useChat';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { Toast } from './components/Toast';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    messages,
    status,
    searchTerm,
    setSearchTerm,
    toast,
    sendMessage,
    syncKnowledge,
    resetChat,
  } = useChat();

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <Toast message={toast} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={resetChat}
        onSelectTopic={sendMessage}
        onIngestDocs={syncKnowledge}
        loadingStatus={status}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full bg-zinc-950">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewChat={resetChat}
        />

        <MessageList
          messages={messages}
          loadingStatus={status}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
          onSelectPrompt={sendMessage}
        />

        <ChatInput
          onSend={sendMessage}
          disabled={status !== 'idle'}
          isSearching={searchTerm.length > 0}
        />
      </div>
    </div>
  );
};

export default App;