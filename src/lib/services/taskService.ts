import type { Task } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { saveTasks as saveTasksToStorage, loadTasks as loadTasksFromStorage } from "@/lib/services/storageService";

let tasks: Task[] = typeof window !== 'undefined' ? loadTasksFromStorage() : [];

const persistTasks = () => {
  saveTasksToStorage(tasks);
};

export const createTask = (
  title: string,
  description?: string,
  dueDate?: Date
): Task => {
  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    dueDate,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  persistTasks();
  return newTask;
};

export const getTasks = (): Task[] => {
  return [...tasks];
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find((task) => task.id === id);
};

export const updateTask = (
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
): Task => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    throw new Error(`Task with id "${id}" not found`);
  }
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };
  persistTasks();
  return { ...tasks[taskIndex] };
};

export const deleteTask = (id: string): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  if (tasks.length < initialLength) {
    persistTasks();
    return true;
  }
  return false;
};

export const updateTaskStatus = (
  id: string,
  status: Task["status"]
): Task => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    throw new Error(`Task with id "${id}" not found for status update`);
  }
  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date();
  persistTasks();
  return { ...tasks[taskIndex] };
};
