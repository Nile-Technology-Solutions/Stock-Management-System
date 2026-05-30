import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardCards from '../../core/dashboard/DashboardCards';
import DashboardCharts from '../../core/dashboard/DashboardCharts';
import { getDashboardDataFromAPI } from '../../core/dashboard/dashboardService';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { RefreshCw, Shield } from '../../../components/icons';

/**
 * Super Admin Dashboard Page
 * Displays comprehensive dashboard for SuperAdmin role users
 * Access: SuperAdmin only
 */
const SuperAdminDashboardPage = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
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

  const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);
    try {
      // Use standardized role 'SuperAdmin'
      const data = await getDashboardDataFromAPI(selectedTimeRange, 'SuperAdmin');
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load SuperAdmin dashboard data:', err);
      setError('Connection to security server timed out. Please check your backend connection.');
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

  if (loading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        <p className="text-slate-500 animate-pulse text-sm font-medium">Synchronizing enterprise data...</p>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-red-500/5 p-8 rounded-3xl max-w-md border border-red-500/10 backdrop-blur-sm">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">System Sync Failure</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{error}</p>
          <Button onClick={() => loadDashboardData()} variant="primary" className="w-full">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative animate-in fade-in duration-500">
      {/* Welcome Section */}
      <GlassCard variant="standard" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-400/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    SuperAdmin Dashboard
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Control Center</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl w-fit">
                <Shield className="w-4 h-4 text-purple-500 animate-pulse" />
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  God Mode: Authorized
                </span>
              </div>
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
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
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

      <DashboardCards data={dashboardData} />
      <DashboardCharts data={dashboardData} />
    </div>
  );
};

export default SuperAdminDashboardPage;
