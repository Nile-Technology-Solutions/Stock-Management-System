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
  ShoppingCart,
  ListTodo,
  FileText,
  PieChart
} from '../icons/index';

import { ROLES, getRoleDisplayName } from '../../utils/roleUtils';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

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


  // Navigation items - Base items for Admin, extended for Super Admin
  const baseNavigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Overview & Analytics'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <Activity className="w-5 h-5" />,
      description: 'Performance Insights'
    },
    {
      name: 'Inventory',
      href: '/admin/stock',
      icon: <Package className="w-5 h-5" />,
      description: 'Inventory Control'
    },
    {
      name: 'Products',
      href: '/admin/showcase',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Product Catalog'
    },
    {
      name: 'Production',
      href: '/admin/production',
      icon: <Settings className="w-5 h-5" />,
      description: 'Manufacturing Hub'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      description: 'Order Management'
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Payment Tracking'
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: <PieChart className="w-5 h-5" />,
      description: 'Business Reports'
    },
    {
      name: 'Daily Tasks',
      href: '/admin/todo',
      icon: <ListTodo className="w-5 h-5" />,
      description: 'Operation Checks'
    },
    {
      name: 'News Room',
      href: '/admin/news',
      icon: <FileText className="w-5 h-5" />,
      description: 'Editorial Hub'
    }
  ];

  // Super Admin exclusive items
  const superAdminItems = [
    {
      name: 'User Management',
      href: '/admin/users',
      icon: <User className="w-5 h-5" />,
      description: 'Roles & Permissions',
      exclusive: true
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: <Shield className="w-5 h-5" />,
      description: 'Security Tracking',
      exclusive: true
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
      description: 'Configuration',
      exclusive: true
    }
  ];

  // Combine navigation items based on role
  const navigationItems = user?.role === ROLES.SUPER_ADMIN 
    ? [...baseNavigationItems, ...superAdminItems]
    : baseNavigationItems;

  const allowedNavItems = navigationItems;


  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  const getCurrentPageTitle = () => {
    const currentItem = allowedNavItems.find(item => isActiveRoute(item.href));
    return currentItem?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-400/2 to-orange-400/2 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-orange-400/2 to-amber-400/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-white px-4 py-2 rounded-lg z-50"
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

      {/* Enhanced Sidebar */}
      <div className={`${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md transition-all duration-300 flex flex-col fixed md:relative inset-y-0 left-0 z-50 transform ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 border-r border-slate-800/50 dark:border-slate-700/50`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800/50 dark:border-slate-700/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5" />
          <div className="relative flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                {/* Logo with futuristic styling */}
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Logo container with white bg */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1.5 shadow-lg shadow-amber-400/25 ring-2 ring-amber-400/30 group-hover:ring-amber-400/50 transition-all duration-300">
                    <img 
                      src="/src/assets/LOGO.png" 
                      alt="AddHomes Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Animated corner dot */}
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />
                </div>
                
                <div>
                  <h1 className="text-xl font-bold text-white">AddHomes</h1>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Admin Panel</p>
                </div>
              </div>
            ) : (
              <div className="relative group mx-auto">
                {/* Collapsed logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1.5 shadow-lg shadow-amber-400/25 ring-2 ring-amber-400/30 group-hover:ring-amber-400/50 transition-all duration-300">
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
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 hidden md:block group"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
            {/* Mobile close button */}
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
        <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Main navigation">
          {allowedNavItems.map((item, index) => {
            // Add separator before Super Admin exclusive items
            const showSeparator = item.exclusive && index > 0 && !allowedNavItems[index - 1].exclusive;
            
            return (
              <div key={item.name}>
                {showSeparator && (
                  <div className="my-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                        Super Admin
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    </div>
                  </div>
                )}
                <Link
                  to={item.href}
                  className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                    isActiveRoute(item.href)
                      ? item.exclusive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-700/50'
                  }`}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                >
                  {isActiveRoute(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                  <span className="flex-shrink-0 relative z-10">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="ml-3 relative z-10 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="block">{item.name}</span>
                        {item.exclusive && (
                          <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded uppercase">
                            Pro
                          </span>
                        )}
                      </div>
                      <span className="text-xs opacity-75 block">{item.description}</span>
                    </div>
                  )}
                  {!sidebarCollapsed && !isActiveRoute(item.href) && (
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/50 dark:border-slate-700/50">
          {!sidebarCollapsed && (
            <div className="mb-4 p-4 bg-slate-800/50 dark:bg-slate-700/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user?.role === ROLES.SUPER_ADMIN 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {getRoleDisplayName(user?.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            {!sidebarCollapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Top Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/30 dark:border-slate-700/40 px-4 sm:px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-200 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg shadow-amber-500/25">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {getCurrentPageTitle()}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
                    Dashboard & Analytics
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              {/* Search - visible on tablet and up */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 border-none outline-none w-24 md:w-32 lg:w-48"
                />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-200 group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* Role Badge - visible on medium screens and up */}
              <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg ${
                user?.role === ROLES.SUPER_ADMIN 
                  ? 'bg-gradient-to-r from-purple-400/10 to-pink-400/10 border border-purple-400/20' 
                  : 'bg-gradient-to-r from-amber-400/10 to-orange-400/10 border border-amber-400/20'
              }`}>
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {getRoleDisplayName(user?.role)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
