import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { 
  Activity, 
  Eye, 
  Shield, 
  Star, 
  MoreHorizontal,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown
} from '../../../components/icons';

const DashboardCharts = ({ data }) => {
  const { recentActivities, topProducts, systemHealth } = data;

  const getActivityIcon = (type) => {
    const iconClasses = "w-3 h-3";
    switch (type) {
      case 'stock':
        return <Package className={`${iconClasses} text-cyan-500`} />;
      case 'order':
        return <ShoppingCart className={`${iconClasses} text-green-500`} />;
      case 'production':
        return <Activity className={`${iconClasses} text-blue-500`} />;
      case 'alert':
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
      case 'quality':
        return <CheckCircle className={`${iconClasses} text-emerald-500`} />;
      default:
        return <div className="w-3 h-3 bg-slate-400 rounded-full"></div>;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Recent Activity */}
      <div className="xl:col-span-2">
        <GlassCard variant="standard" className="h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Real-time Activity</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Live system updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
              </div>
              <Button variant="ghost" size="small">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                <div className="flex-shrink-0 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {activity.action}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {activity.item}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {activity.user}
                        </span>
                        {activity.quantity && (
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {activity.quantity}
                          </span>
                        )}
                        {activity.amount && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {activity.amount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* System Health & Top Products */}
      <div className="space-y-6">
        {/* System Health Monitor */}
        <GlassCard variant="standard">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">System Health</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">All systems operational</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{systemHealth.overall}%</span>
              </div>
            </div>
            
            {Object.entries(systemHealth).slice(1).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{key}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{value}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Products */}
        <GlassCard variant="standard">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Products</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Best performers</p>
              </div>
            </div>
            <Button variant="ghost" size="small">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {product.sales} sales
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {product.revenue}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {product.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardCharts;
