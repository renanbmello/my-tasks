import type { Task } from '@/types';

const TASKS_STORAGE_KEY = 'myAppTasks';

const reviveDates = (key: string, value: any): any => {
  if (key === 'dueDate' || key === 'createdAt' || key === 'updatedAt') {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return value;
};


export const saveTasks = (tasks: Task[]): void => {
  if (typeof window !== 'undefined') {
    try {
      const serializedTasks = JSON.stringify(tasks);
      localStorage.setItem(TASKS_STORAGE_KEY, serializedTasks);
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }
};


export const loadTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    try {
      const serializedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (serializedTasks === null) {
        return [];
      }
      const tasks = JSON.parse(serializedTasks, reviveDates) as Task[];
      return tasks;
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
      return [];
    }
  }
  return [];
};

export {}; 