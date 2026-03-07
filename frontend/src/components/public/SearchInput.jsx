import { useState, useEffect } from 'react';
import { Search } from '../../components/icons';

const SearchInput = ({
  value = '',
  onChange,
  placeholder = "Search products...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onChange) onChange(searchTerm);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (onChange) onChange(val);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 shadow-sm"
        />
      </div>
    </form>
  );
};

export default SearchInput;