import GlassCard from './GlassCard';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon, 
  className = "",
  loading = false 
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  if (loading) {
    return (
      <GlassCard variant="standard" className={className}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
          <div className="mt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="standard" hoverable className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-2">
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg text-slate-600 dark:text-slate-400">
            {icon}
          </div>
        )}
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
            {change}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
            from last month
          </span>
        </div>
      )}
    </GlassCard>
  );
};

export default MetricCard;