import React, { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { useBoardContext } from '../contexts/BoardContext';
import { Board } from '../types';
import { BoardCard } from '../components/BoardCard';
import { BoardForm } from '../components/BoardForm';
import { EmptyBoards } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Board list page component
interface BoardListProps {
  onSelectBoard: (board: Board) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function BoardList({ onSelectBoard, showBackButton, onBack }: BoardListProps) {
  const { boards, createBoard, updateBoard, deleteBoard, loading } = useBoardContext();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  const handleCreateBoard = (title: string, description: string) => {
    createBoard(title, description);
    setShowCreateForm(false);
  };

  const handleUpdateBoard = (title: string, description: string) => {
    if (editingBoard) {
      updateBoard(editingBoard.id, { title, description });
      setEditingBoard(null);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      deleteBoard(boardId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Boards
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize your projects and collaborate with your team
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Board
        </button>
      </div>

      {boards.length === 0 ? (
        <EmptyBoards onCreateBoard={() => setShowCreateForm(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onSelect={onSelectBoard}
              onEdit={setEditingBoard}
              onDelete={handleDeleteBoard}
            />
          ))}
        </div>
      )}

      {showCreateForm && (
        <BoardForm
          onSave={handleCreateBoard}
          onCancel={() => setShowCreateForm(false)}
          loading={loading}
        />
      )}

      {editingBoard && (
        <BoardForm
          board={editingBoard}
          onSave={handleUpdateBoard}
          onCancel={() => setEditingBoard(null)}
          loading={loading}
        />
      )}
    </div>
  );
}