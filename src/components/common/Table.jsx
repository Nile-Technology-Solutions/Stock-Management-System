import { useState } from 'react';
import EmptyState from './EmptyState';
import { ChevronUp, ChevronDown } from '../icons';

const Table = ({ 
  columns = [], 
  data = [], 
  loading = false, 
  emptyMessage = "No data available",
  emptyDescription = "Get started by adding your first item",
  emptyAction,
  onRowClick,
  className = "",
  hoverable = true,
  responsive = true
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const safeData = Array.isArray(data) ? data : [];

  const sortedData = [...safeData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const LoadingSkeleton = () => (
    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700 hidden sm:table-row-group">
      {[...Array(5)].map((_, index) => (
        <tr key={index}>
          {columns.map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const MobileCard = ({ row, index }) => (
    <div
      key={row.id || index}
      className={`p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 ${
        hoverable ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200' : ''
      } ${onRowClick ? 'cursor-pointer' : ''}`}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
    >
      <div className="space-y-2">
        {columns.map((column, colIndex) => {
          if (column.hideOnMobile) return null;
          const key = column.key || column.accessor;
          const label = column.label || column.header;
          const value = row[key];
          
          return (
            <div key={key || colIndex} className={colIndex === 0 ? 'mb-3' : ''}>
              {colIndex === 0 ? (
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {column.render ? column.render(value, row) : value}
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {label}:
                  </span>
                  <span className="text-sm text-slate-900 dark:text-slate-100">
                    {column.render ? column.render(value, row) : value}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (safeData.length === 0 && !loading) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
             <LoadingSkeleton />
          </table>
        </div>
      ) : (
        <>
          <div className={`${responsive ? 'hidden sm:block' : ''} overflow-x-auto`}>
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  {columns.map((column, idx) => {
                    const key = column.key || column.accessor;
                    const label = column.label || column.header;
                    return (
                      <th
                        key={key || idx}
                        className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                          column.sortable !== false && key ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200' : ''
                        }`}
                        onClick={column.sortable !== false && key ? () => handleSort(key) : undefined}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{label}</span>
                          {column.sortable !== false && key && (
                            <div className="flex flex-col">
                              <ChevronUp 
                                className={`w-3 h-3 ${
                                  sortConfig.key === key && sortConfig.direction === 'asc' 
                                    ? 'text-cyan-400' 
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                              <ChevronDown 
                                className={`w-3 h-3 -mt-1 ${
                                  sortConfig.key === key && sortConfig.direction === 'desc' 
                                    ? 'text-cyan-400' 
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {sortedData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className={`${
                      hoverable ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column, colIdx) => {
                      const key = column.key || column.accessor;
                      const value = row[key];
                      
                      const renderDefault = (val) => {
                        if (val === null || val === undefined) return '';
                        if (typeof val === 'object') {
                          return val.name || val.label || val.title || JSON.stringify(val);
                        }
                        return String(val);
                      };

                      return (
                        <td key={key || colIdx} className="px-6 py-4 whitespace-nowrap">
                          {column.render ? column.render(value, row) : (
                            <div className="text-sm text-slate-900 dark:text-slate-100">
                              {renderDefault(value)}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {responsive && (
            <div className="sm:hidden">
              {sortedData.map((row, index) => (
                <div
                  key={row.id || index}
                  className={`p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 ${
                    hoverable ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200' : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  <div className="space-y-2">
                    {columns.map((column, colIndex) => {
                      if (column.hideOnMobile) return null;
                      const key = column.key || column.accessor;
                      const label = column.label || column.header;
                      const value = row[key];
                      
                      const renderDefault = (val) => {
                        if (val === null || val === undefined) return '';
                        if (typeof val === 'object') {
                          return val.name || val.label || val.title || JSON.stringify(val);
                        }
                        return String(val);
                      };
                      
                      return (
                        <div key={key || colIndex} className={colIndex === 0 ? 'mb-3' : ''}>
                          {colIndex === 0 ? (
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {column.render ? column.render(value, row) : renderDefault(value)}
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {label}:
                              </span>
                              <span className="text-sm text-slate-900 dark:text-slate-100">
                                {column.render ? column.render(value, row) : renderDefault(value)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Table;
