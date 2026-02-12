const GlassCard = ({ 
  children, 
  title, 
  description,
  variant = "standard",
  className = "",
  hoverable = false,
  onClick
}) => {
  const baseClasses = "backdrop-blur-md border transition-all duration-200";
  
  const variantClasses = {
    standard: "bg-white/60 dark:bg-slate-900/50 border-white/30 dark:border-slate-700/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/25",
    elevated: "bg-white/60 dark:bg-slate-900/50 border-white/30 dark:border-slate-700/40 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30",
    compact: "bg-white/60 dark:bg-slate-900/50 border-white/30 dark:border-slate-700/40 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/25",
    dark: "bg-slate-900/50 border-slate-700/40 rounded-2xl shadow-lg shadow-black/25"
  };

  const hoverClasses = hoverable ? "hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 cursor-pointer" : "";
  
  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <div className={finalClasses} onClick={onClick}>
      {(title || description) && (
        <div className="p-6 border-b border-white/20 dark:border-slate-700/40">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className={title || description ? "p-6" : "p-6"}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
