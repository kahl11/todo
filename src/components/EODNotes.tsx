'use client';

import React, { useState, useEffect } from 'react';
import { EODNote } from '../types';
import { 
  createEODNote, 
  updateEODNote, 
  deleteEODNote, 
  getEODNoteForDate 
} from '../lib/tasks';
import { 
  FileText, 
  Save, 
  Edit3, 
  Trash2, 
  Plus,
  X
} from 'lucide-react';
import { isPast } from 'date-fns';

interface EODNotesProps {
  userId: string;
  selectedDate: Date;
  isToday: boolean;
}

export const EODNotes: React.FC<EODNotesProps> = ({ userId, selectedDate, isToday }) => {
  const [note, setNote] = useState<EODNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isPastDate = isPast(selectedDate) && !isToday;

  // Load note for the selected date
  useEffect(() => {
    const loadNote = async () => {
      setLoading(true);
      try {
        const existingNote = await getEODNoteForDate(userId, selectedDate);
        setNote(existingNote);
        setContent(existingNote?.content || '');
        setIsEditing(!existingNote && (isToday || isPastDate)); // Allow creating notes for past dates or today
      } catch (error) {
        console.error('Error loading EOD note:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [userId, selectedDate, isToday, isPastDate]);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setSaving(true);
    try {
      if (note) {
        // Update existing note
        await updateEODNote(note.id, { content: content.trim() });
        setNote({ ...note, content: content.trim(), updatedAt: new Date() });
      } else {
        // Create new note
        await createEODNote(userId, { 
          content: content.trim(), 
          date: selectedDate 
        });
        // Reload to get the new note with ID
        const newNote = await getEODNoteForDate(userId, selectedDate);
        setNote(newNote);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving EOD note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    
    if (window.confirm('Are you sure you want to delete this EOD note?')) {
      try {
        await deleteEODNote(note.id);
        setNote(null);
        setContent('');
        setIsEditing(false);
      } catch (error) {
        console.error('Error deleting EOD note:', error);
      }
    }
  };

  const handleCancel = () => {
    setContent(note?.content || '');
    setIsEditing(false);
  };

  const startEditing = () => {
    setContent(note?.content || '');
    setIsEditing(true);
  };

  const dateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            EOD Notes - {isToday ? 'Today' : dateString}
          </h2>
          
          {note && !isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={startEditing}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg transition-colors duration-200"
                title="Edit note"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg transition-colors duration-200"
                title="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you accomplish today?"
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!content.trim() || saving}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Note'}</span>
              </button>
            </div>
          </div>
        ) : note ? (
          <div className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed">
                {note.content}
              </div>
            </div>
            
            {note.updatedAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                Last updated: {note.updatedAt.toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No EOD note for this date
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isToday
                ? "Reflect on what you accomplished today"
                : isPastDate
                  ? "Add notes for this past date"
                  : "No notes were written for this date"
              }
            </p>
            {(isToday || isPastDate) && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Write EOD Note</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
