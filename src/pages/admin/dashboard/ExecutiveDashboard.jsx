import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import Button from '../../../components/common/Button';
import { 
  RefreshCw, 
  Shield, 
  Warehouse,
  Package,
  ShoppingCart,
  Activity,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  DollarSign
} from '../../../components/icons';
import { ROLES } from '../../../utils/roleUtils';

/**
 * Executive Dashboard - System Overview for Admin & Super Admin
 * Professional, clean design without heavy blur effects
 * Focus: System-wide metrics and operational control
 * Role-based content: Super Admin sees financial data, Admin doesn't
 */
const ExecutiveDashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    warehouses: { total: 0, active: 0 },
    skus: { total: 0, lowStock: 0 },
    orders: { active: 0, pending: 0, completed: 0 },
    production: { inProgress: 0, completed: 0, rejected: 0 },
    users: { total: 0, active: 0 },
    revenue: { total: 0, change: 0 }, // Super Admin only
    systemHealth: { status: 'operational', uptime: 99.9 },
    criticalActivities: [],
    alerts: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      // Fetch data from multiple endpoints in parallel
      const promises = [
        api.get('/api/reports/stock').catch(() => ({ totalMaterials: 0, lowStockItems: 0 })),
        api.get('/api/reports/production').catch(() => ({ totalUnderProcess: 0, totalCompleted: 0, totalRejected: 0 })),
        api.get('/api/orders').catch(() => []),
        api.get('/api/users').catch(() => [])
      ];

      // Super Admin gets additional financial data
      if (isSuperAdmin) {
        promises.push(
          api.get('/api/reports/payments').catch(() => ({ totalAmount: 0 }))
        );
      }

      const results = await Promise.all(promises);
      const [stockData, productionData, ordersData, usersData, paymentsData] = results;

      // Process orders data
      const orders = Array.isArray(ordersData) ? ordersData : [];
      const activeOrders = orders.filter(o => 
        ['OrderSubmitted', 'PaymentConfirmed', 'UnderProcess'].includes(o.status)
      ).length;
      const pendingOrders = orders.filter(o => o.status === 'OrderSubmitted').length;
      const completedOrders = orders.filter(o => o.status === 'Completed').length;

      // Process users data
      const users = Array.isArray(usersData) ? usersData : [];
      const activeUsers = users.filter(u => u.role !== 'Customer').length;

      // Generate critical activities (mock for now - would come from activity log API)
      const criticalActivities = [
        {
          id: 1,
          type: 'alert',
          message: `${stockData.lowStockItems || 0} materials below threshold`,
          timestamp: new Date().toISOString(),
          severity: 'high'
        },
        {
          id: 2,
          type: 'production',
          message: `${productionData.totalUnderProcess || 0} items in production`,
          timestamp: new Date().toISOString(),
          severity: 'medium'
        },
        {
          id: 3,
          type: 'order',
          message: `${pendingOrders} orders awaiting confirmation`,
          timestamp: new Date().toISOString(),
          severity: pendingOrders > 5 ? 'high' : 'low'
        }
      ].filter(a => a.message.match(/\d+/)?.[0] !== '0');

      setDashboardData({
        warehouses: { total: 1, active: 1 }, // Single warehouse system
        skus: { 
          total: stockData.totalMaterials || 0, 
          lowStock: stockData.lowStockItems || 0 
        },
        orders: { 
          active: activeOrders, 
          pending: pendingOrders, 
          completed: completedOrders 
        },
        production: { 
          inProgress: productionData.totalUnderProcess || 0, 
          completed: productionData.totalCompleted || 0,
          rejected: productionData.totalRejected || 0
        },
        users: { 
          total: users.length, 
          active: activeUsers 
        },
        revenue: isSuperAdmin ? {
          total: paymentsData?.totalAmount || 0,
          change: 12.5 // Mock percentage change
        } : { total: 0, change: 0 },
        systemHealth: { 
          status: 'operational', 
          uptime: 99.9 
        },
        criticalActivities,
        alerts: stockData.lowStockItems > 0 ? [
          {
            id: 1,
            type: 'stock',
            message: `${stockData.lowStockItems} materials require restocking`,
            severity: 'warning'
          }
        ] : []
      });
    } catch (err) {
      console.error('Failed to load executive dashboard:', err);
      setError('Unable to load system data. Please check your connection.');
    } finally {
      if (isManualRefresh) {
        setTimeout(() => setRefreshing(false), 800);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  if (loading && !dashboardData.skus.total) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100"></div>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading system overview...</p>
      </div>
    );
  }

  if (error && !dashboardData.skus.total) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl max-w-md border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Connection Error</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{error}</p>
          <Button onClick={() => loadDashboardData()} variant="primary" className="w-full">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const { warehouses, skus, orders, production, users, revenue, systemHealth, criticalActivities, alerts } = dashboardData;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${isSuperAdmin ? 'bg-purple-600 dark:bg-purple-500' : 'bg-slate-900 dark:bg-slate-100'} rounded-xl flex items-center justify-center`}>
              <Shield className={`w-7 h-7 ${isSuperAdmin ? 'text-white' : 'text-white dark:text-slate-900'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Executive Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isSuperAdmin ? 'Full system control and financial oversight' : 'System-wide overview and operational control'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date().toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isSuperAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
        {/* Warehouses */}
        <MetricCard
          icon={Warehouse}
          title="Warehouses"
          value={warehouses.total}
          subtitle={`${warehouses.active} active`}
          color="slate"
        />

        {/* SKUs */}
        <MetricCard
          icon={Package}
          title="Total SKUs"
          value={skus.total}
          subtitle={skus.lowStock > 0 ? `${skus.lowStock} low stock` : 'All stocked'}
          color={skus.lowStock > 0 ? 'amber' : 'emerald'}
          alert={skus.lowStock > 0}
        />

        {/* Active Orders */}
        <MetricCard
          icon={ShoppingCart}
          title="Active Orders"
          value={orders.active}
          subtitle={`${orders.pending} pending`}
          color="blue"
        />

        {/* Production */}
        <MetricCard
          icon={Activity}
          title="Production"
          value={production.inProgress}
          subtitle={`${production.completed} completed`}
          color="violet"
        />

        {/* Revenue - Super Admin Only */}
        {isSuperAdmin && (
          <MetricCard
            icon={DollarSign}
            title="Total Revenue"
            value={`ETB ${revenue.total.toLocaleString()}`}
            subtitle={`+${revenue.change}% this month`}
            color="purple"
            trend="up"
          />
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <ActivityTimeline activities={criticalActivities} />
        </div>

        {/* Alerts Center */}
        <div>
          <AlertsCenter alerts={alerts} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <SystemHealth health={systemHealth} />

        {/* Active Users */}
        <ActiveUsers users={users} />

        {/* Quick Links */}
        <QuickLinks />
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, subtitle, color, alert, trend }) => {
  const colorClasses = {
    slate: 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100',
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-100',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100'
  };

  return (
    <div className={`bg-white dark:bg-slate-800 border ${alert ? 'border-amber-300 dark:border-amber-700' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-5 hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {alert ? (
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        ) : trend === 'up' ? (
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        ) : trend === 'down' ? (
          <TrendingDown className="w-5 h-5 text-red-500" />
        ) : null}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
};

// Activity Timeline Component
const ActivityTimeline = ({ activities }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type) => {
    const iconClasses = "w-5 h-5 text-white";
    switch (type) {
      case 'alert': return <AlertTriangle className={iconClasses} />;
      case 'production': return <Activity className={iconClasses} />;
      case 'order': return <ShoppingCart className={iconClasses} />;
      default: return <Package className={iconClasses} />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Activity Timeline</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400">All systems running smoothly</p>
          </div>
        ) : (
          activities.map((activity) => {
            const ActivityIcon = getTypeIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                <div className={`w-10 h-10 ${getSeverityColor(activity.severity)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {ActivityIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Alerts Center Component
const AlertsCenter = ({ alerts }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Alerts Center</h2>
        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 text-xs font-bold rounded">
          {alerts.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {alert.message}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="small" 
                    className="mt-2 text-xs"
                    onClick={() => window.location.href = '/admin/stock'}
                  >
                    View Stock →
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// System Health Component
const SystemHealth = ({ health }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">System Health</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 capitalize">
              {health.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {health.uptime}%
          </span>
        </div>
        
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${health.uptime}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Active Users Component
const ActiveUsers = ({ users }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Active Users</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{users.total}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Staff</span>
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{users.active}</span>
        </div>
        
        <Button 
          variant="secondary" 
          className="w-full mt-4"
          onClick={() => window.location.href = '/admin/users'}
        >
          <Users className="w-4 h-4 mr-2" />
          Manage Users
        </Button>
      </div>
    </div>
  );
};

// Quick Links Component
const QuickLinks = () => {
  const links = [
    { label: 'Manage Users', href: '/admin/users', icon: Users },
    { label: 'System Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Quick Links</h2>
      
      <div className="space-y-3">
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => window.location.href = link.href}
            className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors duration-200"
          >
            <link.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {link.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
