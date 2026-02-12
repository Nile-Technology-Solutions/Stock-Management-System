const Badge = ({ 
  children, 
  variant = "default", 
  size = "medium",
  className = "" 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-0.5 text-xs",
    large: "px-3 py-1 text-sm"
  };

  const variantClasses = {
    // Status colors from DESIGN_SYSTEM.md
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800", 
    error: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800",
    
    // Stock status specific
    normal: "bg-green-100 text-green-800",
    low: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800",
    
    // Production status specific
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-sky-100 text-sky-800",
    delayed: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    
    // General variants
    default: "bg-slate-100 text-slate-800",
    primary: "bg-cyan-100 text-cyan-800",
    secondary: "bg-slate-100 text-slate-600"
  };

  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <span className={finalClasses}>
      {children}
    </span>
  );
};

export default Badge;
