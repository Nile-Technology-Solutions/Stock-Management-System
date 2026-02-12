import Button from './Button';

const EmptyState = ({ 
  title = "No data available", 
  description = "Get started by adding your first item",
  icon,
  action,
  actionText,
  onAction,
  className = ""
}) => {
  const defaultIcon = (
    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
    </svg>
  );

  return (
    <div className={`bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-12 text-center ${className}`}>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          {icon || defaultIcon}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
        {(action || (actionText && onAction)) && (
          <div>
            {action || (
              <Button variant="glass-secondary" onClick={onAction}>
                {actionText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
