import React, { useState } from 'react';
import { Kanban } from 'lucide-react';
import { BoardProvider } from './contexts/BoardContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BoardList } from './pages/BoardList';
import { BoardDetail } from './pages/BoardDetail';
import { ThemeToggle } from './components/ThemeToggle';
import { Board } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<'boards' | 'board'>('boards');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const handleSelectBoard = (board: Board) => {
    setSelectedBoard(board);
    setCurrentView('board');
  };

  const handleBackToBoards = () => {
    setCurrentView('boards');
    setSelectedBoard(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Kanban className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-wide">BoardFlow</h1>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-300">
        <div className="glassmorphic-card p-6 rounded-2xl shadow-xl transition-all duration-300">
          {currentView === 'boards' ? (
            <BoardList onSelectBoard={handleSelectBoard} />
          ) : selectedBoard ? (
            <BoardDetail board={selectedBoard} onBack={handleBackToBoards} />
          ) : (
            <BoardList onSelectBoard={handleSelectBoard} />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BoardProvider>
        <AppContent />
      </BoardProvider>
    </ThemeProvider>
  );
}

export default App;
