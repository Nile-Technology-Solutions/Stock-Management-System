import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import {
  Menu,
  X,
  BarChart3,
  Activity,
  Package,
  Settings,
  DollarSign,
  LogOut,
  Bell,
  Search,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  Sparkles,
  Zap,
  ShoppingCart
} from '../icons/index';

import { ROLES, getRoleDisplayName } from '../../utils/roleUtils';

const SuperAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(5); // Super Admins get more notifications!

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Full navigation items
  const navigationItems = [
    {
      name: 'System Dashboard',
      href: '/super-admin/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'System-wide Overview',
      role: 'SuperAdmin'
    },
    {
      name: 'User Management',
      href: '/super-admin/users',
      icon: <User className="w-5 h-5" />,
      description: 'Roles & Permissions'
    },
    {
      name: 'Financial Reports',
      href: '/super-admin/payments',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Revenue & Payments'
    },
    {
      name: 'Inventory Sync',
      href: '/super-admin/stock',
      icon: <Package className="w-5 h-5" />,
      description: 'Multi-warehouse Stock'
    },
    {
      name: 'Global Settings',
      href: '/super-admin/settings',
      icon: <Settings className="w-5 h-5" />,
      description: 'System Config'
    }
  ];

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => isActiveRoute(item.href));
    return currentItem?.name || 'Super Admin Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'
        } bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md transition-all duration-300 flex flex-col fixed md:relative inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 border-r border-slate-800/50 dark:border-slate-700/50`}>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800/50 dark:border-slate-700/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-pink-400/5" />
          <div className="relative flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SMS Pro</h1>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Super Admin Console</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all hidden md:block"
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${isActiveRoute(item.href)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <span className="flex-shrink-0 relative z-10">{item.icon}</span>
              {!sidebarCollapsed && (
                <div className="ml-3 relative z-10">
                  <span className="block">{item.name}</span>
                  <span className="text-xs opacity-75 block">{item.description}</span>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800/50">
          {!sidebarCollapsed && (
            <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <span className="px-2 py-0.5 bg-purple-500 text-white rounded-full text-[10px] uppercase font-bold">
                    {getRoleDisplayName(user?.role)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all ${sidebarCollapsed ? 'justify-center' : ''
              }`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3">System Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/30 dark:border-slate-700/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-400">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 italic">
              {getCurrentPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 text-slate-400 hover:text-indigo-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications}
              </span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <Shield className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                God Mode Active
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
