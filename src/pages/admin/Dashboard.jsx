// Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { 
  Package, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Plus, 
  Users, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Eye,
  RefreshCw,
  Calendar,
  Star,
  Award,
  Truck,
  ShoppingCart,
  Bell,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  Sparkles
} from '../../components/icons';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced mock data with more realistic values
  const stats = [
    { 
      title: 'Total Products', 
      value: '2,847', 
      change: '+12.5%', 
      changeType: 'positive',
      icon: <Package className="w-6 h-6" />,
      trend: [65, 78, 82, 95, 88, 92, 105],
      color: 'cyan'
    },
    { 
      title: 'Active Orders', 
      value: '156', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: [45, 52, 48, 61, 55, 67, 72],
      color: 'green'
    },
    { 
      title: 'Low Stock Alerts', 
      value: '23', 
      change: '+3', 
      changeType: 'warning',
      icon: <AlertTriangle className="w-6 h-6" />,
      trend: [12, 15, 18, 22, 19, 21, 23],
      color: 'yellow'
    },
    { 
      title: 'Production Units', 
      value: '1,234', 
      change: '+15.8%', 
      changeType: 'positive',
      icon: <Activity className="w-6 h-6" />,
      trend: [890, 920, 980, 1050, 1120, 1180, 1234],
      color: 'blue'
    }
  ];

  // Add revenue stat only for Super Admin
  if (hasRole('super_admin')) {
    stats.push({
      title: 'Monthly Revenue', 
      value: '$127,450', 
      change: '+22.1%', 
      changeType: 'positive',
      icon: <DollarSign className="w-6 h-6" />,
      trend: [85000, 92000, 98000, 105000, 115000, 122000, 127450],
      color: 'purple'
    });
  }

  const recentActivities = [
    { 
      id: 1, 
      action: 'Stock replenished', 
      item: 'Executive Office Desk', 
      time: '2 minutes ago', 
      type: 'stock',
      user: 'John Smith',
      quantity: '+50 units'
    },
    { 
      id: 2, 
      action: 'New order received', 
      item: 'Order #SMS-2024-0156', 
      time: '15 minutes ago', 
      type: 'order',
      user: 'Sarah Johnson',
      amount: '$2,450'
    },
    { 
      id: 3, 
      action: 'Production completed', 
      item: 'Dining Table Set - Batch #DT-567', 
      time: '1 hour ago', 
      type: 'production',
      user: 'Production Team',
      quantity: '25 units'
    },
    { 
      id: 4, 
      action: 'Critical stock alert', 
      item: 'Modern Sofa Collection', 
      time: '2 hours ago', 
      type: 'alert',
      user: 'System',
      quantity: '5 units remaining'
    },
    { 
      id: 5, 
      action: 'Quality check passed', 
      item: 'King Size Platform Bed', 
      time: '3 hours ago', 
      type: 'quality',
      user: 'QA Team',
      quantity: '100% pass rate'
    }
  ];

  const topProducts = [
    { 
      id: 1, 
      name: 'Executive Office Desk', 
      sales: 145, 
      revenue: '$129,550', 
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
      category: 'Office Furniture'
    },
    { 
      id: 2, 
      name: 'Modern Dining Table', 
      sales: 98, 
      revenue: '$63,702', 
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=60&h=60&fit=crop',
      category: 'Dining Room'
    },
    { 
      id: 3, 
      name: 'King Size Platform Bed', 
      sales: 67, 
      revenue: '$87,033', 
      trend: 'down',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&h=60&fit=crop',
      category: 'Bedroom'
    },
    { 
      id: 4, 
      name: 'Luxury Sofa Set', 
      sales: 45, 
      revenue: '$67,500', 
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
      category: 'Living Room'
    }
  ];

  const systemHealth = {
    overall: 98.5,
    database: 99.2,
    api: 97.8,
    storage: 98.9,
    network: 99.1
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

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
    <div className="space-y-8 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/3 to-sky-400/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-sky-400/3 to-cyan-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Enhanced Welcome Section with Real-time Info */}
      <GlassCard variant="standard" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    Welcome back, {user?.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' 
                        : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                    }`}>
                      {user?.role?.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your stock management system is running smoothly. Here's your real-time dashboard overview.
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:text-right">
              <div className="flex flex-col lg:items-end gap-2">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="glass-secondary"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh Data'}
                  </Button>
                  <div className="flex items-center gap-2">
                    <select 
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    >
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                    </select>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      timeZoneName: 'short'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Enhanced Stats Grid with Mini Charts */}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Enhanced Recent Activity */}
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
              {recentActivities.map((activity, index) => (
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

      {/* Enhanced Quick Actions */}
      <GlassCard variant="standard">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Streamline your workflow</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Plus, title: 'Add Product', desc: 'Create new inventory item', color: 'from-cyan-400 to-sky-400' },
            { icon: FileText, title: 'Process Order', desc: 'Handle customer orders', color: 'from-green-400 to-emerald-400' },
            { icon: BarChart3, title: 'View Analytics', desc: 'Detailed insights & reports', color: 'from-purple-400 to-pink-400' },
            { icon: Settings, title: 'System Settings', desc: 'Configure preferences', color: 'from-orange-400 to-red-400' }
          ].map((action, index) => (
            <button key={index} className="group p-6 bg-white/30 dark:bg-slate-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{action.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{action.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">Click to start</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;