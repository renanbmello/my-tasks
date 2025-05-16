"use client"; 
import TaskList from "@/components/TaskList";
import { useTasks } from "@/contexts/TaskContext";
import { getTasksForToday, sortTasksByDueDate } from "@/lib/dateUtils";
import { useMemo } from "react";

export default function TodayPage() {
  const { tasks: allTasks, isLoading } = useTasks();

  const todayTasks = useMemo(() => {
    if (isLoading || !allTasks) return [];
    const filtered = getTasksForToday(allTasks);
    return sortTasksByDueDate(filtered);
  }, [allTasks, isLoading]);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Today's Tasks</h1>
        <TaskList tasksToDisplay={todayTasks} />
      </div>
    </main>
  );
} 