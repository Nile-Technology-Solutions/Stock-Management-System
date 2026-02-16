const PublicWrapper = ({ 
  children, 
  className = "",
  maxWidth = "7xl",
  padding = "default" 
}) => {
  const maxWidthClasses = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6 lg:px-8 py-6',
    default: 'px-4 sm:px-6 lg:px-8 py-12',
    lg: 'px-4 sm:px-6 lg:px-8 py-16'
  };

  return (
    <div className={`min-h-screen bg-slate-50 ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]}`}>
        {children}
      </div>
    </div>
  );
};

export default PublicWrapper;