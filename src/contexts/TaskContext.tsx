"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Task } from '@/types';
import {
  createTask as createTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  updateTaskStatus as updateTaskStatusService,
} from '@/lib/services/taskService';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  addTask: (title: string, description?: string, dueDate?: Date) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string, status: Task['status']) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshTasks = useCallback(() => {
    setIsLoading(true);
    try {
      const currentTasks = getTasksService();
      setTasks(currentTasks);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load tasks'));
      setTasks([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const addTask = async (title: string, description?: string, dueDate?: Date) => {
    try {
      createTaskService(title, description, dueDate);
      refreshTasks();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to add task';
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      updateTaskService(id, updates);
      refreshTasks();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update task';
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      deleteTaskService(id);
      refreshTasks();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete task';
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const toggleTaskStatus = async (id: string, status: Task['status']) => {
    try {
      updateTaskStatusService(id, status);
      refreshTasks();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update task status';
      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}; 