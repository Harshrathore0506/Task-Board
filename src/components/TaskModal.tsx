import React, { useState, useEffect } from 'react';
import { X, Calendar, User, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { useBoardContext } from '../context/BoardContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  task?: Task;
}

/**
 * TaskModal Component - Modal for creating and editing tasks with dark mode
 * Features: Form validation, priority selection, date picker, animations, responsive design
 */
export function TaskModal({ isOpen, onClose, columnId, task }: TaskModalProps) {
  const { createTask, updateTask, tasks, darkMode } = useBoardContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    createdBy: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when modal opens or task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        createdBy: task.createdBy,
      });
    } else {
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: tomorrow.toISOString().split('T')[0],
        createdBy: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  /**
   * Form validation
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Assignee name is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const columnTasks = tasks.filter(t => t.columnId === columnId);
    const order = columnTasks.length;

    if (task) {
      updateTask(task.id, formData);
    } else {
      createTask({
        ...formData,
        columnId,
        order,
      });
    }
    
    handleClose();
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    onClose();
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      createdBy: '',
    });
    setErrors({});
  };

  if (!isOpen) return null;

  const priorityOptions = [
    { 
      value: 'high', 
      label: '🔴 High Priority', 
      color: darkMode ? 'text-red-400' : 'text-red-600' 
    },
    { 
      value: 'medium', 
      label: '🟡 Medium Priority', 
      color: darkMode ? 'text-yellow-400' : 'text-yellow-600' 
    },
    { 
      value: 'low', 
      label: '🟢 Low Priority', 
      color: darkMode ? 'text-green-400' : 'text-green-600' 
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className={`rounded-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b rounded-t-xl transition-colors duration-300 ${
          darkMode 
            ? 'border-gray-700 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' 
            : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h2 className={`text-lg sm:text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {task ? 'Edit Task' : 'Create Task'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className={`p-1 rounded-lg transition-all duration-200 transform hover:scale-110 ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-white'
            }`}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Task Title */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <FileText className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${
                errors.title 
                  ? darkMode
                    ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                    : 'border-red-300 focus:ring-red-500'
                  : darkMode
                    ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Enter task title..."
            />
            {errors.title && (
              <p className={`mt-1 text-xs sm:text-sm ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {errors.title}
              </p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg transition-all duration-200 resize-none text-sm sm:text-base ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
              rows={3}
              placeholder="Add task details..."
            />
          </div>

          {/* Priority Selection - Responsive Grid */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <AlertCircle className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Priority *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: option.value as any })}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 text-xs sm:text-sm font-medium transform hover:scale-105 ${
                    formData.priority === option.value
                      ? darkMode
                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : darkMode
                        ? 'border-gray-600 hover:border-gray-500 text-gray-300 bg-gray-700/50'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date and Assignee - Responsive Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Due Date */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <Calendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${
                  errors.dueDate 
                    ? darkMode
                      ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                      : 'border-red-300 focus:ring-red-500'
                    : darkMode
                      ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
                      : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {errors.dueDate && (
                <p className={`mt-1 text-xs sm:text-sm ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* Assignee */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <User className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Assignee *
              </label>
              <input
                type="text"
                value={formData.createdBy}
                onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${
                  errors.createdBy 
                    ? darkMode
                      ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                      : 'border-red-300 focus:ring-red-500'
                    : darkMode
                      ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
                placeholder="Enter name..."
              />
              {errors.createdBy && (
                <p className={`mt-1 text-xs sm:text-sm ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  {errors.createdBy}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className={`flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t transition-colors duration-300 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 sm:px-6 py-2 transition-all duration-200 font-medium transform hover:scale-105 order-2 sm:order-1 ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 order-1 sm:order-2"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}