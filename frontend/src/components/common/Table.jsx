import { useState } from 'react';
import EmptyState from './EmptyState';
import Button from './Button';
import { ChevronUp, ChevronDown } from '../icons';

const Table = ({ 
  columns, 
  data, 
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

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const LoadingSkeleton = () => (
    <>
      {/* Desktop skeleton */}
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
      
      {/* Mobile skeleton */}
      <div className="sm:hidden divide-y divide-slate-200 dark:divide-slate-700">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </>
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
          // Skip hidden columns on mobile
          if (column.hideOnMobile) return null;
          
          return (
            <div key={column.key} className={colIndex === 0 ? 'mb-3' : ''}>
              {colIndex === 0 ? (
                // First column as main title
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </div>
              ) : (
                // Other columns as key-value pairs
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {column.label}:
                  </span>
                  <span className="text-sm text-slate-900 dark:text-slate-100">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (data.length === 0 && !loading) {
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
        <LoadingSkeleton />
      ) : responsive ? (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                        column.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200' : ''
                      }`}
                      onClick={column.sortable !== false ? () => handleSort(column.key) : undefined}
                      aria-label={column.sortable !== false ? `Sort by ${column.label}` : undefined}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable !== false && (
                          <div className="flex flex-col">
                            <ChevronUp 
                              className={`w-3 h-3 ${
                                sortConfig.key === column.key && sortConfig.direction === 'asc' 
                                  ? 'text-cyan-400' 
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                            <ChevronDown 
                              className={`w-3 h-3 -mt-1 ${
                                sortConfig.key === column.key && sortConfig.direction === 'desc' 
                                  ? 'text-cyan-400' 
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
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
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        {column.render ? column.render(row[column.key], row) : (
                          <div className="text-sm text-slate-900 dark:text-slate-100">
                            {row[column.key]}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="sm:hidden">
            {sortedData.map((row, index) => (
              <MobileCard key={row.id || index} row={row} index={index} />
            ))}
          </div>
        </>
      ) : (
        // Non-responsive table (original behavior)
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                      column.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200' : ''
                    }`}
                    onClick={column.sortable !== false ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable !== false && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={`w-3 h-3 ${
                              sortConfig.key === column.key && sortConfig.direction === 'asc' 
                                ? 'text-cyan-400' 
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                          <ChevronDown 
                            className={`w-3 h-3 -mt-1 ${
                              sortConfig.key === column.key && sortConfig.direction === 'desc' 
                                ? 'text-cyan-400' 
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
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
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row[column.key], row) : (
                        <div className="text-sm text-slate-900 dark:text-slate-100">
                          {row[column.key]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;
