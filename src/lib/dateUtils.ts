import type { Task } from "@/types";

const getStartOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfDay = (date: Date): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};


export const getTasksForToday = (tasks: Task[]): Task[] => {
  const todayStart = getStartOfDay(new Date());
  const todayEnd = getEndOfDay(new Date());
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= todayStart && dueDate <= todayEnd;
  });
};


export const getTasksForCurrentWeek = (tasks: Task[]): Task[] => {
  const now = new Date();
  const currentDayOfWeek = now.getDay();
  
  const weekStartMs = now.getTime() - (currentDayOfWeek * 24 * 60 * 60 * 1000);
  const weekStart = getStartOfDay(new Date(weekStartMs));
  
  const weekEndMs = weekStart.getTime() + (6 * 24 * 60 * 60 * 1000);
  const weekEnd = getEndOfDay(new Date(weekEndMs));

  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= weekStart && dueDate <= weekEnd;
  });
};


export const getTasksForCurrentMonth = (tasks: Task[]): Task[] => {
  const now = new Date();
  const monthStart = getStartOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
  const monthEnd = getEndOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)); 

  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= monthStart && dueDate <= monthEnd;
  });
};


export const sortTasksByDueDate = (tasks: Task[], ascending: boolean = true): Task[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1; 
    if (!b.dueDate) return -1; 

    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();

    return ascending ? dateA - dateB : dateB - dateA;
  });
}; 