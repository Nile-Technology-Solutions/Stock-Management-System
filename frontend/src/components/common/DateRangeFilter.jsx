/**
 * DateRangeFilter Component
 * Reusable date range input component for filtering reports
 */

import React from 'react';

const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <label 
          htmlFor="from-date" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          From Date
        </label>
        <input
          id="from-date"
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
          aria-label="From Date"
        />
      </div>

      <div className="flex-1">
        <label 
          htmlFor="to-date" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          To Date
        </label>
        <input
          id="to-date"
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
          aria-label="To Date"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
