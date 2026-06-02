import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';
import { getDashboardData, addRevenueStatForSuperAdmin } from './dashboardService';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { RefreshCw, Shield } from '../../../components/icons';

const DashboardPage = () => {
  const { user, hasRole } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    let data = await getDashboardData(selectedTimeRange);
    
    // Add revenue stat for super admin
    if (hasRole('super_admin')) {
      data.stats = addRevenueStatForSuperAdmin(data.stats);
    }
    
    setDashboardData(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Welcome Section */}
      <GlassCard variant="standard" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    Welcome back, {user?.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'super_admin' 
                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50' 
                        : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50'
                    }`}>
                      {user?.role?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your system is running smoothly. Here's your real-time dashboard overview.
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:text-right">
              <div className="flex flex-col lg:items-end gap-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="glass-secondary"
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
                  </Button>
                  <select 
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 w-full sm:w-auto"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
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

      {/* Dashboard Cards */}
      <DashboardCards data={dashboardData} hasRole={hasRole} />

      {/* Dashboard Charts and Activities */}
      <DashboardCharts data={dashboardData} />
    </div>
  );
};

export default DashboardPage;
