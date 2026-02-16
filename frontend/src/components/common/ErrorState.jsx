import Button from './Button';
import { AlertCircle } from '../icons';

const ErrorState = ({ 
  title = "Something went wrong", 
  description = "We encountered an error. Please try again.",
  error,
  icon,
  action,
  actionText = "Try Again",
  onAction,
  showDetails = false,
  className = ""
}) => {
  const defaultIcon = (
    <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400" aria-hidden="true" />
  );

  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon Container */}
      <div className="w-16 h-16 mb-4 flex items-center justify-center">
        {icon || defaultIcon}
      </div>
      
      {/* Message */}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md leading-relaxed">
        {description}
      </p>
      
      {/* Error Details (optional) */}
      {showDetails && error && (
        <details className="mb-6 max-w-md w-full">
          <summary className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Show error details
          </summary>
          <div className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
            <code className="text-xs text-red-800 dark:text-red-300 break-all">
              {error.toString()}
            </code>
          </div>
        </details>
      )}
      
      {/* Optional Action */}
      {(action || (actionText && onAction)) && (
        <div>
          {action || (
            <Button variant="primary" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorState;
