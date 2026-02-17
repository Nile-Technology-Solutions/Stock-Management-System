import GlassCard from '../../../components/common/GlassCard';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Activity, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from '../../../components/icons';

const DashboardCards = ({ data, hasRole }) => {
  const { stats } = data;

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatColor = (color) => {
    const colors = {
      cyan: 'from-cyan-400 to-cyan-600',
      green: 'from-green-400 to-green-600',
      yellow: 'from-yellow-400 to-yellow-600',
      blue: 'from-blue-400 to-blue-600',
      purple: 'from-purple-400 to-purple-600'
    };
    return colors[color] || colors.cyan;
  };

  const MiniChart = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`w-1 bg-gradient-to-t ${getStatColor(color)} rounded-full opacity-70`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <GlassCard key={index} variant="standard" hoverable className="group">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${getStatColor(stat.color)} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              <div className="text-white">
                {stat.icon}
              </div>
            </div>
            <div className="text-right">
              <MiniChart data={stat.trend} color={stat.color} />
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{stat.value}</p>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${getChangeColor(stat.changeType)} flex items-center gap-1`}>
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : stat.changeType === 'negative' ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Activity className="w-3 h-3" />
                )}
                {stat.change}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">vs last period</span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default DashboardCards;
