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
  const [notifications] = useState(5);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  const navigationItems = [
    {
      name: 'System Dashboard',
      href: '/super-admin/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'System-wide Overview'
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950 flex relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-400/4 to-orange-400/4 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-orange-400/4 to-amber-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg z-50 shadow-lg shadow-amber-500/25"
      >
        Skip to main content
      </a>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md transition-all duration-300 flex flex-col fixed md:relative inset-y-0 left-0 z-50 transform ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 border-r border-slate-800/50 dark:border-slate-700/50`}>

        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/50 dark:border-slate-700/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5" />
          <div className="relative flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1.5 shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/30 group-hover:ring-amber-500/50 transition-all duration-300">
                    <img 
                      src="/src/assets/LOGO.png" 
                      alt="AddHomes Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">AddHomes</h1>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">Super Admin Console</p>
                </div>
              </div>
            ) : (
              <div className="relative group mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1.5 shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/30 group-hover:ring-amber-500/50 transition-all duration-300">
                  <img 
                    src="/src/assets/LOGO.png" 
                    alt="AddHomes Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-amber-500/10 transition-all duration-200 hidden md:block group"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 md:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                isActiveRoute(item.href)
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-amber-500/10'
              }`}
              aria-current={isActiveRoute(item.href) ? 'page' : undefined}
            >
              {isActiveRoute(item.href) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
              <span className="flex-shrink-0 relative z-10">{item.icon}</span>
              {!sidebarCollapsed && (
                <div className="ml-3 relative z-10 flex-1">
                  <span className="block">{item.name}</span>
                  <span className="text-xs opacity-75 block">{item.description}</span>
                </div>
              )}
              {!sidebarCollapsed && !isActiveRoute(item.href) && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 sm:p-4 border-t border-slate-800/50">
          {!sidebarCollapsed && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[10px] uppercase font-bold">
                    {getRoleDisplayName(user?.role)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            aria-label="System Logout"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            {!sidebarCollapsed && <span className="ml-3">System Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/30 dark:border-slate-700/40 px-4 sm:px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg shadow-amber-500/25">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {getCurrentPageTitle()}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                    Super Admin Console
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-200 group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-amber-500/25">
                  {notifications}
                </span>
              </button>
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;