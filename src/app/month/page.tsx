"use client";

import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { useTasks } from "@/contexts/TaskContext";
import { getTasksForCurrentMonth, sortTasksByDueDate } from "@/lib/dateUtils";
import { useMemo } from "react";

export default function MonthPage() {
  const { tasks: allTasks, isLoading } = useTasks();

  const monthTasks = useMemo(() => {
    if (isLoading || !allTasks) return [];
    const filtered = getTasksForCurrentMonth(allTasks);
    return sortTasksByDueDate(filtered);
  }, [allTasks, isLoading]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center mb-10">This Month's Tasks</h1>
      <TaskForm />
      <TaskList tasksToDisplay={monthTasks} hideOwnAddTaskControls={true} />
    </div>
  );
} 