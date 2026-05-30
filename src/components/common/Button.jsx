const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  className = "", 
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900";
  
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm min-h-[32px]",
    medium: "px-4 py-2 text-sm min-h-[40px]",
    large: "px-6 py-3 text-base min-h-[48px]"
  };

  const variantClasses = {
    primary: "bg-cyan-400 hover:bg-cyan-500 focus:ring-cyan-400 text-white",
    secondary: "border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-400 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800",
    "glass-secondary": "bg-white/60 dark:bg-slate-900/50 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-400/50 text-slate-700 dark:text-slate-300 hover:shadow-lg hover:shadow-cyan-400/10 focus:ring-cyan-400",
    outline: "border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-400 text-slate-700 dark:text-slate-300 bg-transparent",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-slate-400 text-slate-600 dark:text-slate-400",
    danger: "bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white"
  };

  const disabledClasses = "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-none";

  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${
    disabled || loading ? disabledClasses : variantClasses[variant]
  } ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClasses}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div 
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
