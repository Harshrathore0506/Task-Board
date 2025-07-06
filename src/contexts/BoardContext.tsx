import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Board, Column, Task, BoardContextType } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Create context for board management
const BoardContext = createContext<BoardContextType | undefined>(undefined);

// Custom hook to use board context
export function useBoardContext() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Board provider component
export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useLocalStorage<Board[]>("taskboard-boards", []);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);

  // Update current board when boards change
  useEffect(() => {
    if (currentBoard) {
      const updatedBoard = boards.find((board) => board.id === currentBoard.id);
      if (updatedBoard) {
        setCurrentBoard(updatedBoard);
      }
    }
  }, [boards, currentBoard]);

  // Initialize with demo data if no boards exist
  useEffect(() => {
    if (boards.length === 0) {
      const demoBoard: Board = {
        id: generateId(),
        title: "My First Board",
        description:
          "Welcome to your task board! Start by creating tasks and organizing them.",
        columns: [
          {
            id: generateId(),
            title: "To Do",
            tasks: [
              {
                id: generateId(),
                title: "Plan project architecture",
                description:
                  "Design the overall structure and components needed for the project",
                assignee: "John Doe",
                priority: "high",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: generateId(),
                title: "Research best practices",
                description:
                  "Look into industry standards and best practices for similar projects",
                assignee: "Jane Smith",
                priority: "medium",
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: generateId(),
            title: "In Progress",
            tasks: [
              {
                id: generateId(),
                title: "Set up development environment",
                description:
                  "Configure local development environment with all necessary tools",
                assignee: "Bob Johnson",
                priority: "high",
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: generateId(),
            title: "Done",
            tasks: [
              {
                id: generateId(),
                title: "Initial project setup",
                description:
                  "Created project repository and basic folder structure",
                assignee: "Alice Brown",
                priority: "low",
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBoards([demoBoard]);
    }
  }, [boards.length, setBoards]);

  // Create new board
  const createBoard = (title: string, description: string) => {
    setLoading(true);
    setTimeout(() => {
      const newBoard: Board = {
        id: generateId(),
        title,
        description,
        columns: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBoards((prev) => [...prev, newBoard]);
      setLoading(false);
    }, 300);
  };

  // Update board
  const updateBoard = (id: string, updates: Partial<Board>) => {
    setLoading(true);
    setTimeout(() => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === id
            ? { ...board, ...updates, updatedAt: new Date().toISOString() }
            : board
        )
      );
      setLoading(false);
    }, 300);
  };

  // Delete board
  const deleteBoard = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setBoards((prev) => prev.filter((board) => board.id !== id));
      if (currentBoard?.id === id) {
        setCurrentBoard(null);
      }
      setLoading(false);
    }, 300);
  };

  // Create column
  const createColumn = (boardId: string, title: string) => {
    setLoading(true);
    setTimeout(() => {
      const newColumn: Column = {
        id: generateId(),
        title,
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: [...board.columns, newColumn],
                updatedAt: new Date().toISOString(),
              }
            : board
        )
      );
      setLoading(false);
    }, 300);
  };

  // Update column
  const updateColumn = (
    boardId: string,
    columnId: string,
    updates: Partial<Column>
  ) => {
    setLoading(true);
    setTimeout(() => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((column) =>
                  column.id === columnId
                    ? {
                        ...column,
                        ...updates,
                        updatedAt: new Date().toISOString(),
                      }
                    : column
                ),
                updatedAt: new Date().toISOString(),
              }
            : board
        )
      );
      setLoading(false);
    }, 300);
  };

  // Delete column
  const deleteColumn = (boardId: string, columnId: string) => {
    setLoading(true);
    setTimeout(() => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.filter(
                  (column) => column.id !== columnId
                ),
                updatedAt: new Date().toISOString(),
              }
            : board
        )
      );
      setLoading(false);
    }, 300);
  };

  // Create task
  const createTask = (
    boardId: string,
    columnId: string,
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);
    setTimeout(() => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((column) =>
                  column.id === columnId
                    ? {
                        ...column,
                        tasks: [...column.tasks, newTask],
                        updatedAt: new Date().toISOString(),
                      }
                    : column
                ),
                updatedAt: new Date().toISOString(),
              }
            : board
        )
      );
      setLoading(false);
    }, 300);
  };

  // Update task
  const updateTask = (
    boardId: string,
    columnId: string,
    taskId: string,
    updates: Partial<Task>
  ) => {
    setLoading(true);
    setTimeout(() => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((column) =>
                  column.id === columnId
                    ? {
                        ...column,
                        tasks: column.tasks.map((task) =>
                          task.id === taskId
                            ? {
                                ...task,
                                ...updates,
                                updatedAt: new Date().toISOString(),
                              }
                            : task
                        ),
                        updatedAt: new Date().toISOString(),
                      }
                    : column
                ),
                updatedAt: new Date().toISOString(),
              }
            : board
        )
      );
      setLoading(false);
    }, 300);
  };

  // Delete task
  const deleteTask = (boardId: string, columnId: string, taskId: string) => {
    setLoading(true);
    setTimeout(() => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((column) =>
                  column.id === columnId
                    ? {
                        ...column,
                        tasks: column.tasks.filter(
                          (task) => task.id !== taskId
                        ),
                        updatedAt: new Date().toISOString(),
                      }
                    : column
                ),
                updatedAt: new Date().toISOString(),
              }
            : board
        )
      );
      setLoading(false);
    }, 300);
  };

  // Move task between columns
  const moveTask = (
    boardId: string,
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number
  ) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== boardId) return board;

        const fromColumn = board.columns.find((col) => col.id === fromColumnId);
        const toColumn = board.columns.find((col) => col.id === toColumnId);
        const task = fromColumn?.tasks.find((t) => t.id === taskId);

        if (!fromColumn || !toColumn || !task) return board;

        const updatedTask = { ...task, updatedAt: new Date().toISOString() };

        return {
          ...board,
          columns: board.columns.map((column) => {
            if (column.id === fromColumnId) {
              return {
                ...column,
                tasks: column.tasks.filter((t) => t.id !== taskId),
                updatedAt: new Date().toISOString(),
              };
            }
            if (column.id === toColumnId) {
              const newTasks = [...column.tasks];
              newTasks.splice(newIndex, 0, updatedTask);
              return {
                ...column,
                tasks: newTasks,
                updatedAt: new Date().toISOString(),
              };
            }
            return column;
          }),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Reorder task within same column
  const reorderTask = (
    boardId: string,
    columnId: string,
    taskId: string,
    newIndex: number
  ) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== boardId) return board;

        return {
          ...board,
          columns: board.columns.map((column) => {
            if (column.id !== columnId) return column;

            const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
            if (taskIndex === -1) return column;

            const newTasks = [...column.tasks];
            const [movedTask] = newTasks.splice(taskIndex, 1);
            newTasks.splice(newIndex, 0, {
              ...movedTask,
              updatedAt: new Date().toISOString(),
            });

            return {
              ...column,
              tasks: newTasks,
              updatedAt: new Date().toISOString(),
            };
          }),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const value: BoardContextType = {
    boards,
    currentBoard,
    loading,
    createBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}
