'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  completedTaskCounts?: Record<string, number>; // Date string (YYYY-MM-DD) -> count
}

export const Calendar: React.FC<CalendarProps> = ({ 
  selectedDate, 
  onDateSelect, 
  completedTaskCounts = {} 
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const dateKey = format(day, 'yyyy-MM-dd');
      const taskCount = completedTaskCounts[dateKey] || 0;
      
      days.push(
        <div
          className={`h-12 w-full flex items-center justify-center relative cursor-pointer text-sm transition-colors duration-200 ${
            !isSameMonth(day, monthStart)
              ? "text-gray-300 dark:text-gray-600"
              : isSameDay(day, selectedDate)
              ? "bg-indigo-600 text-white"
              : isToday(day)
              ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          key={day.toString()}
          onClick={() => onDateSelect(cloneDay)}
        >
          <span>{formattedDate}</span>
          {taskCount > 0 && (
            <div className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold" style={{ fontSize: '8px' }}>
                {taskCount > 9 ? '9+' : taskCount}
              </span>
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-gray-700" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }



  const nextMonth = () => {
    setCurrentMonth(addDays(currentMonth, 32));
  };

  const prevMonth = () => {
    setCurrentMonth(addDays(currentMonth, -32));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {rows}
        </div>
      </div>
    </div>
  );
};