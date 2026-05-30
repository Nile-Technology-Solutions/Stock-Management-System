import { useState } from 'react';

const CategoryFilter = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  className = ""
}) => {
  const allCategories = ['All', ...categories];
  const [isExpanded, setIsExpanded] = useState(false);

  // Still useful if they have 20+ categories, but horizontal pills take up much less space
  const displayLimit = 8;
  const showToggle = allCategories.length > displayLimit;
  const visibleCategories = isExpanded ? allCategories : allCategories.slice(0, displayLimit);

  return (
    <div className={`bg-transparent ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mr-2">Categories:</span>
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category === 'All' ? '' : category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${(category === 'All' && !selectedCategory) || category === selectedCategory
              ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-md shadow-cyan-500/30 border border-transparent'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
          >
            {category}
          </button>
        ))}

        {showToggle && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200 ml-1"
          >
            {isExpanded ? 'Less' : `+${allCategories.length - displayLimit} More`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;