const Loader = ({ size = "medium", className = "", text = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-slate-200 dark:border-slate-700 border-t-cyan-400 dark:border-t-cyan-500 rounded-full animate-spin`}
      ></div>
      {text && (
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">{text}</p>
      )}
    </div>
  );
};

export default Loader;
