import React, { useState } from 'react';
import type { Task } from '@/types';
import { useTasks } from '@/contexts/TaskContext';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const taskAnimationVariants = {
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  completed: { opacity: 0.5, scale: 0.95, x: 0, transition: { duration: 0.3 } }, 
  pending: { scale: [1, 1.05, 1], opacity: 1, transition: { duration: 0.3 } }, 
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await updateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' });
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isTaskCompleted = task.status === 'completed';
  const isOverdue = dueDate && !isTaskCompleted && dueDate < new Date();

  const taskItemStyle = `
    flex items-center justify-between p-4 bg-white shadow rounded-lg 
    transition-all duration-300 ease-in-out
    ${isTaskCompleted ? 'opacity-50 line-through' : 'opacity-100'}
    ${isCompleting ? 'opacity-0 scale-95' : ''}
  `;

  return (
    <motion.li
      animate={task.status === 'completed' ? 'completed' : 'pending'}
      initial="visible"
      variants={taskAnimationVariants}
      layout
      className={`
        p-4 rounded-lg shadow-md flex items-center justify-between 
        transition-colors duration-300 ease-in-out
        ${task.status === 'completed' ? 'bg-green-100 dark:bg-green-800/50' : 'bg-white dark:bg-gray-700'}
        ${isOverdue ? 'border-l-4 border-red-500 dark:border-red-400' : ''}
      `}
    >
      <div className="flex items-center flex-grow min-w-0 mr-4">
        <input 
          type="checkbox" 
          checked={isTaskCompleted}
          onChange={handleToggleComplete}
          disabled={isCompleting || isDeleting}
          className={`form-checkbox h-5 w-5 rounded 
            ${isTaskCompleted ? 'text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-600' : 'text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-600'}
            bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500
            transition duration-150 ease-in-out cursor-pointer
          `}
          aria-label={`Mark task "${task.title}" as ${isTaskCompleted ? 'pending' : 'complete'}`}
        />
        <div className="ml-3 flex-grow min-w-0">
          <h3 
            className={`text-lg font-medium truncate 
              ${isTaskCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}
            `}
            title={task.title}
          >
            {task.title}
          </h3>
          {task.description && (
            <p 
              className={`text-sm truncate 
                ${isTaskCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}
              `}
              title={task.description}
            >
              {task.description}
            </p>
          )}
          {dueDate && (
            <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : (isTaskCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400')}`}>
              Due: {dueDate.toLocaleDateString('en-GB')} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center space-x-2">
        <button
          onClick={() => onEdit(task)}
          disabled={isDeleting || isTaskCompleted}
          className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Edit task"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Delete task"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.li>
  );
};

export default TaskItem; 