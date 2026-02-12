const SkeletonCard = ({ 
  className = "",
  variant = "standard",
  lines = 3,
  showHeader = true 
}) => {
  const variantClasses = {
    standard: "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6",
    glass: "bg-white/60 dark:bg-slate-900/50 backdrop-blur-md border border-white/30 dark:border-slate-700/40 rounded-2xl shadow-lg p-6"
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <div className="animate-pulse">
        {showHeader && (
          <div className="mb-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        )}
        
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div 
              key={index}
              className={`h-4 bg-slate-200 dark:bg-slate-700 rounded ${
                index === lines - 1 ? 'w-2/3' : 'w-full'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;