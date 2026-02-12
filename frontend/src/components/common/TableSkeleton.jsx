const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className = "" 
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Table Header */}
        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
            ))}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div 
                    key={colIndex} 
                    className={`h-4 bg-slate-200 dark:bg-slate-700 rounded ${
                      colIndex === 0 ? 'w-full' : colIndex === columns - 1 ? 'w-1/2' : 'w-3/4'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;