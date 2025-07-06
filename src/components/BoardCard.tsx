import React, { useState } from 'react';
import { Calendar, FileText, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Board } from '../types';

interface BoardCardProps {
  board: Board;
  onSelect: (board: Board) => void;
  onEdit: (board: Board) => void;
  onDelete: (boardId: string) => void;
}

export function BoardCard({ board, onSelect, onEdit, onDelete }: BoardCardProps) {
  const [showActions, setShowActions] = useState(false);

  const taskCount = board.columns.reduce((total, column) => total + column.tasks.length, 0);
  const columnCount = board.columns.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className="relative group p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm
      bg-white/70 dark:bg-gray-800/70 backdrop-blur-md transition-all duration-300 hover:shadow-lg"
    >
      {/* Top row: Title + Actions */}
      <div className="flex justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
            {board.title}
          </h3>
          {board.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {board.description}
            </p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown */}
          {showActions && (
            <div className="absolute right-0 top-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md py-1 z-10 w-36">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(board);
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(board.id);
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {columnCount} {columnCount === 1 ? 'column' : 'columns'}
          </span>
          <span>
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(board.updatedAt)}
        </div>
      </div>

      {/* Open Board Button */}
      <button
        onClick={() => onSelect(board)}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-md transition-all duration-200"
      >
        Open Board
      </button>
    </div>
  );
}
