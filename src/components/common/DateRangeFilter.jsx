/**
 * DateRangeFilter Component
 * Reusable date range input component for filtering reports with futuristic design
 */

const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <label 
          htmlFor="from-date" 
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          From Date
        </label>
        <input
          id="from-date"
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-white/20 rounded-lg 
                     backdrop-blur-sm bg-white/10 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200 hover:bg-white/15"
          aria-label="From Date"
        />
      </div>

      <div className="flex-1">
        <label 
          htmlFor="to-date" 
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          To Date
        </label>
        <input
          id="to-date"
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-white/20 rounded-lg 
                     backdrop-blur-sm bg-white/10 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200 hover:bg-white/15"
          aria-label="To Date"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
