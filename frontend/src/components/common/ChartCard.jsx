import GlassCard from './GlassCard';

const ChartCard = ({ 
  title, 
  description, 
  children, 
  className = "",
  actions = null,
  loading = false 
}) => {
  return (
    <GlassCard 
      variant="standard" 
      className={`${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </GlassCard>
  );
};

export default ChartCard;
