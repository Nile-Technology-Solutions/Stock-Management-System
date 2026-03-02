import Button from './Button';

/**
 * ErrorState Component
 * Displays a premium error message with an icon and retry action
 */
const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We couldn't load the information you're looking for.",
  icon,
  onRetry,
  className = ""
}) => {
  const defaultIcon = (
    <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
      <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center animate-fade-in-up ${className}`}>
      <div className="group">
        <div className="flex justify-center">
          {icon || defaultIcon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">{message}</p>
        
        {onRetry && (
          <Button 
            variant="primary" 
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-8 shadow-lg shadow-red-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
