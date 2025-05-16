"use client";

import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { useTasks } from "@/contexts/TaskContext";
import { getTasksForCurrentWeek, sortTasksByDueDate } from "@/lib/dateUtils";
import { useMemo } from "react";

export default function WeekPage() {
  const { tasks: allTasks, isLoading } = useTasks();

  const weekTasks = useMemo(() => {
    if (isLoading || !allTasks) return [];
    const filtered = getTasksForCurrentWeek(allTasks);
    return sortTasksByDueDate(filtered);
  }, [allTasks, isLoading]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center mb-10">This Week's Tasks</h1>
      <TaskForm />
      <TaskList tasksToDisplay={weekTasks} hideOwnAddTaskControls={true} />
    </div>
  );
} 