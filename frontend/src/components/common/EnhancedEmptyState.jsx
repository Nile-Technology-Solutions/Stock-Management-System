import GlassCard from './GlassCard';
import Button from './Button';

const EnhancedEmptyState = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = "",
  variant = "glass" // glass or standard
}) => {
  const content = (
    <div className="text-center py-12">
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button 
          variant="primary" 
          onClick={onAction}
          className="inline-flex items-center"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );

  if (variant === 'glass') {
    return (
      <GlassCard variant="standard" className={className}>
        {content}
      </GlassCard>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      {content}
    </div>
  );
};

export default EnhancedEmptyState;
