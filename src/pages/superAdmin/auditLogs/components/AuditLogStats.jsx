import { Activity, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const AuditLogStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const successCount = stats.statusStats?.find(s => s.status === 'Success')?.count || 0;
  const failedCount = stats.statusStats?.find(s => s.status === 'Failed')?.count || 0;
  const warningCount = stats.statusStats?.find(s => s.status === 'Warning')?.count || 0;

  const statCards = [
    {
      title: 'Total Logs',
      value: stats.totalLogs.toLocaleString(),
      icon: Activity,
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/10 to-blue-600/10',
    },
    {
      title: 'Successful',
      value: successCount.toLocaleString(),
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
    },
    {
      title: 'Failed',
      value: failedCount.toLocaleString(),
      icon: AlertCircle,
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-500/10 to-rose-600/10',
    },
    {
      title: 'Actions Tracked',
      value: stats.actionStats.length,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-600/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
          <p className="text-3xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AuditLogStats;
