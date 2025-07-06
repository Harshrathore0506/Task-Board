import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter, Calendar, User, AlertCircle, Sparkles, Moon, Sun } from 'lucide-react';
import { useBoardContext } from '../context/BoardContext';
import { Task, Column } from '../types';
import { TaskCard } from './TaskCard';
import { ColumnComponent } from './ColumnComponent';

interface FilterState {
  search: string;
  priority: 'all' | 'high' | 'medium' | 'low';
  dueDate: 'all' | 'overdue' | 'today' | 'week';
}

/**
 * BoardDetail Component - Main board view with columns and tasks
 * Features: Task filtering, drag & drop, column management, dark mode, responsive design
 */
export function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    boards, 
    columns, 
    tasks, 
    currentBoard, 
    setCurrentBoard, 
    createColumn, 
    darkMode, 
    toggleDarkMode 
  } = useBoardContext();
  
  // Filter state for task search and filtering
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: 'all',
    dueDate: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load board data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      const board = boards.find(b => b.id === id);
      if (board) {
        setCurrentBoard(board);
      } else {
        // Redirect to home if board not found
        navigate('/', { replace: true });
      }
    }
  }, [id, boards, setCurrentBoard, navigate]);

  // Get columns for current board, sorted by order
  const boardColumns = columns
    .filter(col => col.boardId === id)
    .sort((a, b) => a.order - b.order);

  /**
   * Filter tasks based on current filter criteria
   */
  const getFilteredTasks = (columnId: string) => {
    let columnTasks = tasks
      .filter(task => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);

    // Apply search filter - search in title and description
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      columnTasks = columnTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      columnTasks = columnTasks.filter(task => task.priority === filters.priority);
    }

    // Apply due date filter
    if (filters.dueDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      columnTasks = columnTasks.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0);

        switch (filters.dueDate) {
          case 'overdue':
            return taskDueDate < today;
          case 'today':
            return taskDueDate.getTime() === today.getTime();
          case 'week':
            return taskDueDate <= weekFromNow;
          default:
            return true;
        }
      });
    }

    return columnTasks;
  };

  // Check if any filters are currently active
  const hasActiveFilters = filters.search || filters.priority !== 'all' || filters.dueDate !== 'all';

  /**
   * Handle creating a new column
   */
  const handleCreateColumn = () => {
    const columnTitle = prompt('Enter column title:');
    if (columnTitle && id) {
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      createColumn({
        title: columnTitle,
        boardId: id,
        order: boardColumns.length,
        color: randomColor,
      });
    }
  };

  /**
   * Handle back navigation with proper routing
   */
  const handleBackNavigation = () => {
    // Force navigation to home page
    navigate(-1);
    // Also reset current board to ensure clean state
    setCurrentBoard(null);
  };

  // Show loading state while board is being loaded
  if (!currentBoard) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      } flex items-center justify-center`}>
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className={`animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4 ${
              darkMode 
                ? 'border-blue-300 border-t-blue-500' 
                : 'border-blue-200 border-t-blue-600'
            }`}></div>
            <Sparkles className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your board...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header Section - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 animate-slide-in">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={handleBackNavigation}
              className={`group p-2 sm:p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex-shrink-0 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            </button>
            <div className={`rounded-xl p-3 sm:p-4 shadow-sm border transition-all duration-300 backdrop-blur-sm flex-1 sm:flex-initial ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white border-gray-100'
            }`}>
              <h1 className={`text-lg sm:text-2xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {currentBoard.title}
              </h1>
              <p className={`text-xs sm:text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {currentBoard.description}
              </p>
            </div>
          </div>
          
          {/* Controls - Responsive */}
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

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 shadow-sm transform hover:scale-105 text-sm ${
                hasActiveFilters
                  ? darkMode 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-blue-600 text-white shadow-blue-200'
                  : darkMode 
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                  darkMode 
                    ? 'bg-blue-400 text-blue-900' 
                    : 'bg-white text-blue-600'
                }`}>
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel - Responsive */}
        {showFilters && (
          <div className={`rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm transition-all duration-500 animate-fade-in ${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Search Filter */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Search Tasks
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search by title..."
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg transition-all duration-200 text-sm ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' 
                        : 'border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }`}
                  />
                </div>
              </div>
              
              {/* Priority Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value as FilterState['priority'] })}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg transition-all duration-200 text-sm ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-500 focus:bg-gray-700' 
                      : 'border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
              
              {/* Due Date Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Due Date
                </label>
                <select
                  value={filters.dueDate}
                  onChange={(e) => setFilters({ ...filters, dueDate: e.target.value as FilterState['dueDate'] })}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg transition-all duration-200 text-sm ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-500 focus:bg-gray-700' 
                      : 'border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                >
                  <option value="all">All Dates</option>
                  <option value="overdue">⚠️ Overdue</option>
                  <option value="today">📅 Today</option>
                  <option value="week">📆 This Week</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="mt-4 sm:mt-6 flex justify-end animate-fade-in">
                <button
                  onClick={() => setFilters({ search: '', priority: 'all', dueDate: 'all' })}
                  className={`text-sm transition-colors font-medium hover:scale-105 transform duration-200 ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Board Columns - Responsive Horizontal Scroll */}
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 scrollbar-thin">
          {boardColumns.map((column, index) => (
            <div 
              key={column.id} 
              className="animate-slide-in flex-shrink-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ColumnComponent
                column={column}
                tasks={getFilteredTasks(column.id)}
              />
            </div>
          ))}
          
          {/* Add New Column Button - Responsive */}
          <div className="flex-shrink-0 animate-slide-in" style={{ animationDelay: `${boardColumns.length * 100}ms` }}>
            <div className={`w-72 sm:w-80 rounded-xl shadow-sm border-2 border-dashed transition-all duration-300 hover:scale-105 transform ${
              darkMode 
                ? 'bg-gray-800/30 backdrop-blur-sm border-gray-600 hover:border-blue-500 hover:bg-gray-800/50' 
                : 'bg-white/60 backdrop-blur-sm border-gray-300 hover:border-blue-400'
            }`}>
              <button
                onClick={handleCreateColumn}
                className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 rounded-xl p-6 sm:p-8 transition-all duration-300 group ${
                  darkMode 
                    ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-800/30' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                  darkMode 
                    ? 'bg-gray-700 group-hover:bg-blue-500/20' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="font-semibold text-sm sm:text-base">Add Column</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}