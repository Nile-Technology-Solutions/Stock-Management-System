const Card = ({ 
  children, 
  title, 
  description,
  variant = "standard",
  className = "",
  hoverable = false,
  onClick
}) => {
  const baseClasses = "bg-white border border-slate-200 transition-colors duration-200";
  
  const variantClasses = {
    standard: "rounded-xl shadow-sm",
    elevated: "rounded-xl shadow-md",
    compact: "rounded-lg shadow-sm",
    borderless: "rounded-xl shadow-none"
  };

  const hoverClasses = hoverable ? "hover:shadow-md cursor-pointer" : "";
  
  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <div className={finalClasses} onClick={onClick}>
      {(title || description) && (
        <div className="p-6 border-b border-slate-200">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className={title || description ? "p-6" : "p-6"}>
        {children}
      </div>
    </div>
  );
};

export default Card;
