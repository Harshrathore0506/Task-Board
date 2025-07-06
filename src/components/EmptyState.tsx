import React from 'react';
import { Plus, Inbox, FolderOpen } from 'lucide-react';

// Empty state component for when there are no items
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
        {icon || <Inbox className="w-full h-full" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Specific empty states for common scenarios
export function EmptyBoards({ onCreateBoard }: { onCreateBoard: () => void }) {
  return (
    <EmptyState
      icon={<FolderOpen className="w-full h-full" />}
      title="No boards yet"
      description="Create your first board to start organizing your tasks and collaborating with your team."
      actionLabel="Create Board"
      onAction={onCreateBoard}
    />
  );
}

export function EmptyTasks({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <EmptyState
      icon={<Inbox className="w-full h-full" />}
      title="No tasks yet"
      description="Add your first task to get started with organizing your work."
      actionLabel="Create Task"
      onAction={onCreateTask}
    />
  );
}