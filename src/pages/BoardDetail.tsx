import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Settings } from 'lucide-react';
import { useBoardContext } from '../contexts/BoardContext';
import { Board, Task, Column as ColumnType, FilterState } from '../types';
import { Column } from '../components/Column';
import { TaskForm } from '../components/TaskForm';
import { ColumnForm } from '../components/ColumnForm';
import { BoardForm } from '../components/BoardForm';
import { SearchFilter } from '../components/SearchFilter';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Board detail page component
interface BoardDetailProps {
  board: Board;
  onBack: () => void;
}

export function BoardDetail({ board, onBack }: BoardDetailProps) {
  const {
    boards,
    updateBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    loading,
  } = useBoardContext();

  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Get current board data
  const currentBoard = boards.find(b => b.id === board.id) || board;

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: '',
    dueDateFilter: '',
  });

  // Filter tasks based on search and filters
  const filterTasks = (tasks: Task[]): Task[] => {
    return tasks.filter((task) => {
      const matchesSearch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPriority = !filters.priority || task.priority === filters.priority;

      const matchesDueDate = !filters.dueDateFilter || (() => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const today = new Date();
        const todayStr = today.toDateString();
        const taskDateStr = taskDate.toDateString();

        switch (filters.dueDateFilter) {
          case 'overdue':
            return taskDate < today && taskDateStr !== todayStr;
          case 'today':
            return taskDateStr === todayStr;
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return taskDate >= today && taskDate <= weekFromNow;
          case 'month':
            const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            return taskDate >= today && taskDate <= monthFromNow;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesPriority && matchesDueDate;
    });
  };

  // Handle task creation
  const handleCreateTask = (columnId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    createTask(currentBoard.id, columnId, taskData);
    setShowCreateTask(null);
  };

  // Handle task update
  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      const column = currentBoard.columns.find(col => col.tasks.some(t => t.id === editingTask.id));
      if (column) {
        updateTask(currentBoard.id, column.id, editingTask.id, taskData);
        setEditingTask(null);
      }
    }
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const column = currentBoard.columns.find(col => col.tasks.some(t => t.id === taskId));
      if (column) {
        deleteTask(currentBoard.id, column.id, taskId);
      }
    }
  };

  // Handle column creation
  const handleCreateColumn = (title: string) => {
    createColumn(currentBoard.id, title);
    setShowCreateColumn(false);
  };

  // Handle column update
  const handleUpdateColumn = (title: string) => {
    if (editingColumn) {
      updateColumn(currentBoard.id, editingColumn.id, { title });
      setEditingColumn(null);
    }
  };

  // Handle column deletion
  const handleDeleteColumn = (columnId: string) => {
    const column = currentBoard.columns.find(col => col.id === columnId);
    if (column && column.tasks.length > 0) {
      if (!window.confirm('This column contains tasks. Are you sure you want to delete it? All tasks will be lost.')) {
        return;
      }
    }
    deleteColumn(currentBoard.id, columnId);
  };

  // Handle board update
  const handleUpdateBoard = (title: string, description: string) => {
    updateBoard(currentBoard.id, { title, description });
    setEditingBoard(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    const column = currentBoard.columns.find(col => col.tasks.some(t => t.id === task.id));
    if (column) {
      setDraggedFromColumn(column.id);
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (columnId: string) => {
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedTask && draggedFromColumn) {
      if (draggedFromColumn === columnId) {
        // Same column - reorder to end
        const column = currentBoard.columns.find(col => col.id === columnId);
        if (column) {
          const currentIndex = column.tasks.findIndex(t => t.id === draggedTask.id);
          const newIndex = column.tasks.length - 1;
          if (currentIndex !== newIndex) {
            reorderTask(currentBoard.id, columnId, draggedTask.id, newIndex);
          }
        }
      } else {
        // Different column - move to end
        const toColumn = currentBoard.columns.find(col => col.id === columnId);
        if (toColumn) {
          moveTask(currentBoard.id, draggedTask.id, draggedFromColumn, columnId, toColumn.tasks.length);
        }
      }
    }
    
    setDraggedTask(null);
    setDraggedFromColumn(null);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentBoard.title}
            </h1>
            {currentBoard.description && (
              <p className="text-gray-600 dark:text-gray-400">
                {currentBoard.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingBoard(currentBoard)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="Edit board"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateColumn(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Column
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <SearchFilter filters={filters} onFiltersChange={setFilters} />

      {/* Columns */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {currentBoard.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            filteredTasks={filterTasks(column.tasks)}
            onEditColumn={setEditingColumn}
            onDeleteColumn={handleDeleteColumn}
            onCreateTask={setShowCreateTask}
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(column.id)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            isDragOver={dragOverColumn === column.id}
          />
        ))}
      </div>

      {/* Forms */}
      {showCreateColumn && (
        <ColumnForm
          onSave={handleCreateColumn}
          onCancel={() => setShowCreateColumn(false)}
          loading={loading}
        />
      )}

      {showCreateTask && (
        <TaskForm
          onSave={(taskData) => handleCreateTask(showCreateTask, taskData)}
          onCancel={() => setShowCreateTask(null)}
          loading={loading}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          loading={loading}
        />
      )}

      {editingColumn && (
        <ColumnForm
          column={editingColumn}
          onSave={handleUpdateColumn}
          onCancel={() => setEditingColumn(null)}
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