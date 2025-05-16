import React, { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import type { Task } from '@/types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

interface TaskListProps {
  tasksToDisplay?: Task[];
  hideOwnAddTaskControls?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasksToDisplay, hideOwnAddTaskControls = false }) => {
  const { tasks: allTasks, isLoading, error } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const tasks = tasksToDisplay || allTasks;

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    if (!hideOwnAddTaskControls) setShowAddForm(false);
  };

  const handleFormSubmit = () => {
    setEditingTask(null);
    if (!hideOwnAddTaskControls) setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    if (!hideOwnAddTaskControls) setShowAddForm(false);
  };
  
  const handleAddNewTask = () => {
    setEditingTask(null);
    if (!hideOwnAddTaskControls) setShowAddForm(true);
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 dark:text-red-400 py-8">Error loading tasks: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {!hideOwnAddTaskControls && (
        <>
          <div className="mb-6 flex justify-end">
            <button 
              onClick={handleAddNewTask}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Add New Task
            </button>
          </div>

          {(editingTask || showAddForm) && (
            <div className="mb-8">
              <TaskForm 
                taskToEdit={editingTask} 
                onFormSubmit={handleFormSubmit} 
                onCancel={handleCancelEdit} 
              />
            </div>
          )}
        </>
      )}

      {tasks.length === 0 && (hideOwnAddTaskControls || (!editingTask && !showAddForm)) && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks yet. Add one to get started!</p>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
};

export default TaskList; 