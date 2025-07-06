import React, { useState } from 'react';
import { Plus, Edit, Trash2, MoreHorizontal, Grip } from 'lucide-react';
import { Column, Task } from '../types';
import { useBoardContext } from '../context/BoardContext';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

interface ColumnComponentProps {
  column: Column;
  tasks: Task[];
}

/**
 * ColumnComponent - Represents a single column in the board
 * Features: Task management, drag & drop, column editing, dark mode support, responsive design
 */
export function ColumnComponent({ column, tasks }: ColumnComponentProps) {
  const { updateColumn, deleteColumn, moveTask, darkMode } = useBoardContext();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [draggedOver, setDraggedOver] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  /**
   * Handle column title update
   */
  const handleColumnUpdate = () => {
    if (columnTitle.trim() && columnTitle !== column.title) {
      updateColumn(column.id, { title: columnTitle });
    }
    setIsEditingColumn(false);
  };

  /**
   * Handle column deletion with confirmation
   */
  const handleColumnDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${column.title}"? This will also delete all tasks in this column.`)) {
      deleteColumn(column.id);
    }
  };

  /**
   * Drag and drop handlers for task movement
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set draggedOver to false if we're leaving the column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    
    const taskData = e.dataTransfer.getData('application/json');
    if (taskData) {
      const { taskId, sourceColumnId } = JSON.parse(taskData);
      
      // Only move if dropping in a different column
      if (sourceColumnId !== column.id) {
        moveTask(taskId, column.id, tasks.length);
      }
    }
  };

  // Sort tasks by priority first, then by order for better visual hierarchy
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.order - b.order;
  });

  // Get priority distribution for column header
  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex-shrink-0 w-72 sm:w-80">
      <div
        className={`rounded-xl shadow-sm border transition-all duration-300 backdrop-blur-sm ${
          draggedOver 
            ? darkMode
              ? 'ring-2 ring-blue-400 shadow-xl transform scale-105 border-blue-400 bg-gray-800/70'
              : 'ring-2 ring-blue-500 shadow-lg transform scale-105 border-blue-200'
            : darkMode
              ? 'border-gray-700 hover:shadow-lg bg-gray-800/50 hover:bg-gray-800/70'
              : 'border-gray-200 hover:shadow-md bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Column Header - Responsive */}
        <div className={`p-3 sm:p-4 border-b rounded-t-xl transition-all duration-300 ${
          darkMode 
            ? 'border-gray-700 bg-gradient-to-r from-gray-800/70 to-gray-700/70' 
            : 'border-gray-100 bg-gradient-to-r from-gray-50 to-white'
        }`}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            {isEditingColumn ? (
              <input
                type="text"
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                onBlur={handleColumnUpdate}
                onKeyPress={(e) => e.key === 'Enter' && handleColumnUpdate()}
                className={`text-base sm:text-lg font-bold bg-transparent border-none outline-none rounded px-2 py-1 flex-1 transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-gray-700' 
                    : 'text-gray-900 focus:ring-2 focus:ring-blue-500'
                }`}
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: column.color }}
                ></div>
                <h3 className={`text-base sm:text-lg font-bold truncate ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {column.title}
                </h3>
              </div>
            )}
            
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Task Count Badge */}
              <div className="flex items-center space-x-1">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tasks.length}
                </span>
                {priorityStats.high > 0 && (
                  <span className="bg-red-100 text-red-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold animate-pulse">
                    {priorityStats.high}
                  </span>
                )}
              </div>
              
              {/* Column Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                {showColumnMenu && (
                  <div className={`absolute right-0 top-full mt-1 rounded-lg shadow-lg border py-1 z-10 min-w-[120px] backdrop-blur-sm animate-fade-in ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={() => {
                        setIsEditingColumn(true);
                        setShowColumnMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-all duration-200 ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        handleColumnDelete();
                        setShowColumnMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-all duration-200 ${
                        darkMode 
                          ? 'text-red-400 hover:bg-red-500/20' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Add Task Button - Responsive */}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className={`w-full flex items-center justify-center space-x-2 text-sm rounded-lg py-2 transition-all duration-300 border transform hover:scale-105 ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400' 
                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200 hover:border-blue-300'
            }`}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium">Add Task</span>
          </button>
        </div>

        {/* Tasks Container - Responsive */}
        <div className="p-3 sm:p-4 space-y-3 min-h-[200px] sm:min-h-[300px] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin">
          {sortedTasks.map((task, index) => (
            <div 
              key={task.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                index={index}
                columnId={column.id}
                onEdit={() => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
              />
            </div>
          ))}
          
          {/* Empty State - Responsive */}
          {tasks.length === 0 && (
            <div className={`text-center py-8 sm:py-12 animate-fade-in ${
              darkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <div className={`rounded-lg p-4 sm:p-6 border-2 border-dashed transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/30 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <Grip className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
                  darkMode ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <p className="text-sm font-medium mb-1">No tasks yet</p>
                <p className="text-xs">Drop tasks here or click "Add Task"</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
          setShowColumnMenu(false);
        }}
        columnId={column.id}
        task={editingTask}
      />
    </div>
  );
}