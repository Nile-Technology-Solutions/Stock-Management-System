import { useState } from 'react';
import { Search } from '../../components/icons';

const SearchInput = ({ 
  onSearch, 
  placeholder = "Search products...",
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Debounced search - trigger search after user stops typing
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onSearch(value);
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
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 bg-white"
        />
      </div>
    </form>
  );
};

export default SearchInput;