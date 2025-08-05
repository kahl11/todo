'use client';

import React, { useState } from 'react';
import { CreateTaskData, Priority } from '../types';
import { Plus, Calendar, Flag } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: CreateTaskData) => Promise<void>;
  onCancel?: () => void;
  isOpen: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, isOpen }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(3);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        deadline: deadline ? new Date(deadline) : undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority(3);
      setDeadline('');
      onCancel?.();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create New Task</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Flag className="h-4 w-4 inline mr-1" />
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value) as Priority)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 font-medium"
              >
                <option value={1}>Priority 1 (Lowest)</option>
                <option value={2}>Priority 2 (Low)</option>
                <option value={3}>Priority 3 (Medium)</option>
                <option value={4}>Priority 4 (High)</option>
                <option value={5}>Priority 5 (Urgent)</option>
              </select>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Deadline (Optional)
              </label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 font-medium"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};