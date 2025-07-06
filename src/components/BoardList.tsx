import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Edit, Trash2, KanbanSquare, Eye, Moon, Sun } from 'lucide-react';
import { useBoardContext } from '../context/BoardContext';
import { Board } from '../types';

interface BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board?: Board;
}

function BoardModal({ isOpen, onClose, board }: BoardModalProps) {
  const { createBoard, updateBoard, darkMode } = useBoardContext();
  const [formData, setFormData] = useState({
    title: board?.title || '',
    description: board?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      if (board) {
        updateBoard(board.id, formData);
      } else {
        createBoard(formData);
      }
      onClose();
      setFormData({ title: '', description: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className={`rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100 ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white'
      }`}>
        <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {board ? 'Edit Board' : 'Create New Board'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Board Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md transition-all duration-200 text-sm sm:text-base ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Enter board title"
              required
            />
          </div>
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md transition-all duration-200 text-sm sm:text-base ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
              rows={3}
              placeholder="Enter board description"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 transition-colors duration-200 order-2 sm:order-1 ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 order-1 sm:order-2"
            >
              {board ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function BoardList() {
  const navigate = useNavigate();
  const { boards, deleteBoard, setCurrentBoard, columns, tasks, darkMode, toggleDarkMode } = useBoardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | undefined>();

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setIsModalOpen(true);
  };

  const handleDeleteBoard = (board: Board) => {
    if (window.confirm(`Are you sure you want to delete "${board.title}"?`)) {
      deleteBoard(board.id);
    }
  };

  const handleBoardClick = (board: Board) => {
    setCurrentBoard(board);
    navigate(`/board/${board.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getBoardStats = (boardId: string) => {
    const boardColumns = columns.filter(col => col.boardId === boardId);
    const boardTasks = tasks.filter(task => 
      boardColumns.some(col => col.id === task.columnId)
    );
    
    return {
      columns: boardColumns.length,
      tasks: boardTasks.length,
      highPriorityTasks: boardTasks.filter(task => task.priority === 'high').length
    };
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 animate-slide-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
              <KanbanSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold gradient-text ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Task Boards
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 shadow-sm transform hover:scale-105 text-sm ${
                darkMode 
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30' 
                  : 'bg-gray-800/10 text-gray-700 hover:bg-gray-800/20 border border-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-3 h-3 sm:w-4 sm:h-4" /> : <Moon className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="font-medium hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md transform hover:scale-105 text-sm"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Board</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className={`p-4 rounded-xl mb-4 inline-block ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } backdrop-blur-sm`}>
              <KanbanSquare className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
            </div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-600'
            }`}>
              No boards yet
            </h3>
            <p className={`mb-6 text-sm sm:text-base ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Create your first board to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Create Board
            </button>
          </div>
        ) : (
          <div className={`rounded-xl shadow-lg overflow-hidden backdrop-blur-sm animate-fade-in ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white'
          }`}>
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {boards.map((board, index) => {
                  const stats = getBoardStats(board.id);
                  return (
                    <div 
                      key={board.id}
                      className={`p-4 transition-all duration-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                      onClick={() => handleBoardClick(board)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="p-1 bg-blue-600 rounded-lg flex-shrink-0">
                            <KanbanSquare className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base truncate">{board.title}</h3>
                            <p className={`text-sm truncate ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {board.description || 'No description'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBoard(board);
                            }}
                            className={`p-2 rounded-md transition-all duration-200 ${
                              darkMode 
                                ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/20' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBoard(board);
                            }}
                            className={`p-2 rounded-md transition-all duration-200 ${
                              darkMode 
                                ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20' 
                                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {stats.columns} cols
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {stats.tasks} tasks
                          </span>
                          {stats.highPriorityTasks > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {stats.highPriorityTasks} high
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(board.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/70 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <tr>
                    <th className={`px-4 lg:px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Board Name</th>
                    <th className={`px-4 lg:px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Description</th>
                    <th className={`px-4 lg:px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Stats</th>
                    <th className={`px-4 lg:px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Created</th>
                    <th className={`px-4 lg:px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-300 ${
                  darkMode ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {boards.map((board, index) => {
                    const stats = getBoardStats(board.id);
                    return (
                      <tr 
                        key={board.id} 
                        className={`transition-all duration-300 cursor-pointer hover:scale-[1.01] transform ${
                          darkMode 
                            ? 'hover:bg-gray-700/30' 
                            : 'hover:bg-gray-50'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => handleBoardClick(board)}
                      >
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-1 bg-blue-600 rounded-lg">
                              <KanbanSquare className="w-4 h-4 text-white" />
                            </div>
                            <span className={`font-medium ${
                              darkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                              {board.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {board.description || 'No description'}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {stats.columns} columns
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {stats.tasks} tasks
                            </span>
                            {stats.highPriorityTasks > 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                {stats.highPriorityTasks} high
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className={`flex items-center text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(board.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBoardClick(board);
                              }}
                              className={`p-2 rounded-md transition-all duration-200 transform hover:scale-110 ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/20' 
                                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                              title="View Board"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditBoard(board);
                              }}
                              className={`p-2 rounded-md transition-all duration-200 transform hover:scale-110 ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/20' 
                                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                              title="Edit Board"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBoard(board);
                              }}
                              className={`p-2 rounded-md transition-all duration-200 transform hover:scale-110 ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20' 
                                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                              }`}
                              title="Delete Board"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <BoardModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBoard(undefined);
          }}
          board={editingBoard}
        />
      </div>
    </div>
  );
}