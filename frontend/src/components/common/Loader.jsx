const Loader = ({ size = "medium", className = "", text = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-slate-200 border-t-cyan-400 rounded-full animate-spin`}
      ></div>
      {text && (
        <p className="mt-3 text-sm font-medium text-slate-600">{text}</p>
      )}
    </div>
  );
};

export default Loader;
