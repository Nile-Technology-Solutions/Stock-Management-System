// Analytics.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Package, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle,
  Users,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Zap,
  Target,
  Award,
  Clock,
  Globe,
  PieChart,
  LineChart,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Settings,
  Search,
  MoreHorizontal
} from '../../components/icons';

const Analytics = () => {
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('orders');
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced mock analytics data with more realistic values
  const getMetricsData = () => ({
    totalOrders: { 
      value: '3,247', 
      change: '+18.5%', 
      changeType: 'positive',
      trend: [2456, 2678, 2890, 3012, 3156, 3247],
      target: 3500,
      completion: 92.8
    },
    completedOrders: { 
      value: '2,956', 
      change: '+12.3%', 
      changeType: 'positive',
      trend: [2234, 2445, 2567, 2689, 2834, 2956],
      target: 3000,
      completion: 98.5
    },
    pendingOrders: { 
      value: '291', 
      change: '+25.2%', 
      changeType: 'warning',
      trend: [156, 189, 234, 267, 278, 291],
      target: 200,
      completion: 145.5
    },
    stockItems: { 
      value: '1,847', 
      change: '+5.1%', 
      changeType: 'positive',
      trend: [1678, 1723, 1756, 1789, 1823, 1847],
      target: 2000,
      completion: 92.4
    },
    lowStockItems: { 
      value: '43', 
      change: '-12%', 
      changeType: 'positive',
      trend: [67, 58, 52, 48, 45, 43],
      target: 30,
      completion: 143.3
    },
    productionBatches: { 
      value: '256', 
      change: '+28.7%', 
      changeType: 'positive',
      trend: [156, 178, 198, 223, 245, 256],
      target: 300,
      completion: 85.3
    },
    ...(hasRole('super_admin') && {
      revenue: { 
        value: '$247,890', 
        change: '+32.4%', 
        changeType: 'positive',
        trend: [145678, 167890, 189234, 212456, 234567, 247890],
        target: 300000,
        completion: 82.6
      },
      avgOrderValue: { 
        value: '$76.34', 
        change: '+8.8%', 
        changeType: 'positive',
        trend: [51.23, 56.78, 62.45, 68.90, 72.15, 76.34],
        target: 80,
        completion: 95.4
      },
      profit: {
        value: '$89,456',
        change: '+24.1%',
        changeType: 'positive',
        trend: [56789, 62345, 67890, 74567, 82345, 89456],
        target: 100000,
        completion: 89.5
      },
      conversionRate: {
        value: '3.8%',
        change: '+0.5%',
        changeType: 'positive',
        trend: [2.8, 3.1, 3.3, 3.5, 3.6, 3.8],
        target: 4.5,
        completion: 84.4
      }
    })
  });

  const metrics = getMetricsData();

  // Advanced chart data
  const orderTrendData = [
    { name: 'Jan', orders: 2186, completed: 1956, pending: 230, revenue: 167890, profit: 45678 },
    { name: 'Feb', orders: 2405, completed: 2178, pending: 227, revenue: 189234, profit: 52345 },
    { name: 'Mar', orders: 2637, completed: 2401, pending: 236, revenue: 212456, profit: 58901 },
    { name: 'Apr', orders: 2798, completed: 2567, pending: 231, revenue: 234567, profit: 65432 },
    { name: 'May', orders: 2978, completed: 2745, pending: 233, revenue: 256789, profit: 72109 },
    { name: 'Jun', orders: 3247, completed: 2956, pending: 291, revenue: 247890, profit: 89456 }
  ];

  const categoryPerformance = [
    { name: 'Office Furniture', orders: 1245, revenue: 98765, growth: 18.5, color: 'from-cyan-400 to-sky-400' },
    { name: 'Dining Room', orders: 987, revenue: 76543, growth: 12.3, color: 'from-green-400 to-emerald-400' },
    { name: 'Bedroom', orders: 756, revenue: 65432, growth: 8.7, color: 'from-purple-400 to-pink-400' },
    { name: 'Living Room', orders: 543, revenue: 54321, growth: 15.2, color: 'from-orange-400 to-red-400' },
    { name: 'Storage', orders: 432, revenue: 43210, growth: 6.9, color: 'from-blue-400 to-indigo-400' }
  ];

  const stockDistributionData = [
    { name: 'In Stock', value: 1456, percentage: 78.9, color: '#22C55E', status: 'healthy' },
    { name: 'Low Stock', value: 348, percentage: 18.8, color: '#FACC15', status: 'warning' },
    { name: 'Out of Stock', value: 43, percentage: 2.3, color: '#EF4444', status: 'critical' }
  ];

  const topProducts = [
    { 
      id: 1, 
      name: 'Executive Office Desk Pro', 
      orders: 456, 
      revenue: '$45,678', 
      stock: 145,
      growth: 18.5,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
      category: 'Office Furniture',
      rating: 4.8,
      trend: 'up'
    },
    { 
      id: 2, 
      name: 'Modern Dining Table Elite', 
      orders: 334, 
      revenue: '$33,456', 
      stock: 89,
      growth: 12.3,
      image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=60&h=60&fit=crop',
      category: 'Dining Room',
      rating: 4.6,
      trend: 'up'
    },
    { 
      id: 3, 
      name: 'King Platform Bed Luxury', 
      orders: 298, 
      revenue: '$38,740', 
      stock: 67,
      growth: 8.7,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&h=60&fit=crop',
      category: 'Bedroom',
      rating: 4.9,
      trend: 'up'
    },
    { 
      id: 4, 
      name: 'Premium Sofa Collection', 
      orders: 187, 
      revenue: '$28,050', 
      stock: 23,
      growth: -2.1,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
      category: 'Living Room',
      rating: 4.4,
      trend: 'down'
    },
    { 
      id: 5, 
      name: 'Smart Storage System', 
      orders: 156, 
      revenue: '$18,720', 
      stock: 234,
      growth: 15.2,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
      category: 'Storage',
      rating: 4.7,
      trend: 'up'
    }
  ];

  const realtimeMetrics = {
    activeUsers: 47,
    currentOrders: 23,
    systemLoad: 68.5,
    responseTime: '1.2s',
    uptime: '99.9%'
  };

  const handleRefresh = async () => {
    setRefreshing(true);
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

  const getStatColor = (color) => {
    const colors = {
      cyan: 'from-cyan-400 to-cyan-600',
      green: 'from-green-400 to-green-600',
      yellow: 'from-yellow-400 to-yellow-600',
      blue: 'from-blue-400 to-blue-600',
      purple: 'from-purple-400 to-purple-600',
      orange: 'from-orange-400 to-orange-600'
    };
    return colors[color] || colors.cyan;
  };

  const MiniChart = ({ data, color = 'cyan' }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-12">
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`w-1.5 bg-gradient-to-t ${getStatColor(color)} rounded-full opacity-70`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  const ProgressRing = ({ percentage, size = 60, strokeWidth = 4 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-cyan-500 transition-all duration-500"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/3 to-pink-400/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/3 to-indigo-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Enhanced Header */}
      <GlassCard variant="standard" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-400/25">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    Advanced Analytics
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Deep insights and performance metrics for data-driven decisions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:text-right">
              <div className="flex flex-col lg:items-end gap-3">
                <div className="flex items-center gap-3">
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
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    >
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">Last Year</option>
                    </select>
                  </div>

                  <Button variant="primary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
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
                    Last updated: {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Real-time System Status */}
      <GlassCard variant="standard">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Real-time System Status</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Live performance metrics</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">All Systems Operational</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Object.entries(realtimeMetrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Enhanced Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(metrics).map(([key, metric], index) => (
          <GlassCard key={key} variant="standard" hoverable className="group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${
                key.includes('revenue') || key.includes('profit') ? 'from-purple-400 to-pink-400' :
                key.includes('order') ? 'from-cyan-400 to-sky-400' :
                key.includes('stock') ? 'from-green-400 to-emerald-400' :
                key.includes('production') ? 'from-blue-400 to-indigo-400' :
                'from-orange-400 to-red-400'
              } rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <div className="text-white">
                  {key.includes('revenue') || key.includes('profit') ? <DollarSign className="w-6 h-6" /> :
                   key.includes('order') ? <ShoppingCart className="w-6 h-6" /> :
                   key.includes('stock') ? <Package className="w-6 h-6" /> :
                   key.includes('production') ? <Activity className="w-6 h-6" /> :
                   <BarChart3 className="w-6 h-6" />}
                </div>
              </div>
              <div className="text-right">
                <MiniChart data={metric.trend} color={
                  key.includes('revenue') || key.includes('profit') ? 'purple' :
                  key.includes('order') ? 'cyan' :
                  key.includes('stock') ? 'green' :
                  key.includes('production') ? 'blue' : 'orange'
                } />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">{metric.value}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold ${getChangeColor(metric.changeType)} flex items-center gap-1`}>
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : metric.changeType === 'negative' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Activity className="w-3 h-3" />
                  )}
                  {metric.change}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">vs last period</span>
              </div>

              {/* Progress towards target */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Target Progress</span>
                <ProgressRing percentage={metric.completion} size={40} strokeWidth={3} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Category Performance & Stock Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Category Performance */}
        <div className="xl:col-span-2">
          <GlassCard variant="standard">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-lg">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Category Performance</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Revenue by product category</p>
                </div>
              </div>
              <Button variant="ghost" size="small">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {categoryPerformance.map((category, index) => (
                <div key={category.name} className="flex items-center gap-4 p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          +{category.growth}%
                        </span>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{category.orders} orders</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{category.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Stock Distribution */}
        <div>
          <GlassCard variant="standard">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Stock Distribution</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Inventory status</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {stockDistributionData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-400/10 to-emerald-400/10 border border-green-400/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Inventory Health</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                78.9% of inventory is well-stocked. Consider restocking 43 items.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Top Products Performance */}
      <GlassCard variant="standard">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Products Performance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Best performing products with detailed metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="small">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="small">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{product.orders}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Orders</div>
                  </div>
                  {hasRole('super_admin') && (
                    <div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">{product.revenue}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Revenue</div>
                    </div>
                  )}
                  <div>
                    <div className={`text-lg font-bold ${
                      product.stock < 30 ? 'text-red-600 dark:text-red-400' :
                      product.stock < 100 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {product.stock}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Stock</div>
                  </div>
                  <div>
                    <div className={`flex items-center justify-center gap-1 text-lg font-bold ${
                      product.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {product.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(product.growth)}%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Growth</div>
                  </div>
                </div>
                
                <Button variant="ghost" size="small" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Analytics;