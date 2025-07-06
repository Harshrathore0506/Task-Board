import React, { useState } from 'react';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { EmptyTasks } from './EmptyState';

// Column component for organizing tasks
interface ColumnProps {
  column: ColumnType;
  filteredTasks: Task[];
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  isDragOver?: boolean;
}

export function Column({
  column,
  filteredTasks,
  onEditColumn,
  onDeleteColumn,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDragOver = false,
}: ColumnProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-w-80 max-w-80 flex flex-col transition-all duration-200 ${
        isDragOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">{column.title}</h2>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium">
            {filteredTasks.length}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-20">
              <button
                onClick={() => {
                  onEditColumn(column);
                  setShowActions(false);
                }}
                className="w-full px-3 py-1.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center whitespace-nowrap"
              >
                <Edit className="w-3 h-3 mr-2" />
                Edit Column
              </button>
              <button
                onClick={() => {
                  onDeleteColumn(column.id);
                  setShowActions(false);
                }}
                className="w-full px-3 py-1.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center whitespace-nowrap"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add task button */}
      <button
        onClick={() => onCreateTask(column.id)}
        className="w-full mb-4 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-500 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>

      {/* Task list */}
      <div className="flex-1 space-y-3 min-h-32">
        {filteredTasks.length === 0 ? (
          <EmptyTasks onCreateTask={() => onCreateTask(column.id)} />
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}