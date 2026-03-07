import { useState } from 'react';

const CategoryFilter = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  className = ""
}) => {
  const allCategories = ['All', ...categories];
  const [isExpanded, setIsExpanded] = useState(false);

  const displayLimit = 5;
  const showToggle = allCategories.length > displayLimit;
  const visibleCategories = isExpanded ? allCategories : allCategories.slice(0, displayLimit);

  return (
    <div className={`bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>

      <div className="space-y-2">
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category === 'All' ? '' : category)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${(category === 'All' && !selectedCategory) || category === selectedCategory
                ? 'bg-cyan-400 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            {category}
          </button>
        ))}

        {showToggle && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center px-4 py-2 mt-2 rounded-lg font-medium text-cyan-600 hover:bg-cyan-50 transition-all duration-200"
          >
            {isExpanded ? 'Show Less' : `Show All (${allCategories.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;