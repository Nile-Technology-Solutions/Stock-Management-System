import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from '../../components/icons';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
