'use client';

import React, { useState } from 'react';
import { Task } from '../types';
import { 
  Calendar, 
  Flag, 
  Trash2, 
  Edit3, 
  Check, 
  MoreVertical,
  Clock
} from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { getPriorityColor, getPriorityLabel } from '../lib/tasks';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const updates: Partial<Task> = { 
        completed: !task.completed,
        completedDate: !task.completed ? new Date() : undefined
      };
      await onUpdate(task.id, updates);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isDueToday = task.deadline && isToday(task.deadline);
  const isOverdue = task.deadline && isPast(task.deadline) && !task.completed && !isDueToday;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200 ${
      task.completed ? 'opacity-60' : ''
    } ${isOverdue ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-indigo-500'
            } ${loading ? 'opacity-50' : ''}`}
          >
            {task.completed && <Check className="h-3 w-3" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${
              task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${
                task.completed ? 'line-through' : ''
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-4 mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                getPriorityColor(task.priority)
              }`}>
                <Flag className="h-3 w-3 mr-1" />
                {getPriorityLabel(task.priority)}
              </span>

              {task.deadline && (
                <div className={`flex items-center text-xs ${
                  isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {isOverdue ? (
                    <Clock className="h-3 w-3 mr-1" />
                  ) : (
                    <Calendar className="h-3 w-3 mr-1" />
                  )}
                  {format(task.deadline, 'MMM d, yyyy')}
                  {isOverdue && ' (Overdue)'}
                  {isDueToday && ' (Today)'}
                </div>
              )}

              {task.completed && task.completedDate && (
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <Check className="h-3 w-3 mr-1" />
                  Completed {format(task.completedDate, 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Task
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};