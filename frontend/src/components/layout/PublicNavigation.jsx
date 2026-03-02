import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ShoppingBag, User, LogOut, Shield } from '../../components/icons';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const PublicNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, isPublicUser } = useAuth();

  // Handle scroll effect for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'News', path: '/news' },
    { name: 'Track Order', path: '/order-tracking' }
  ];

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/30 dark:border-slate-700/30 shadow-lg shadow-black/5' 
        : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-white/30 dark:border-slate-700/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              {/* Logo Image with Futuristic Container */}
              <div className="relative">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-sky-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Logo container with white bg in dark mode */}
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-white p-1.5 shadow-lg shadow-slate-900/10 dark:shadow-cyan-400/10 ring-2 ring-transparent group-hover:ring-cyan-400/50 transition-all duration-300 group-hover:scale-105">
                  <img 
                    src="/src/assets/LOGO.png" 
                    alt="SMS Nile Tech Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Animated corner accent */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              </div>
              
              {/* Text Logo */}
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
                  SMS Nile Tech
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
                  Stock Management
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium transition-all duration-200 group ${
                  isActiveLink(item.path)
                    ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400'
                }`}
              >
                {item.name}
                {/* Animated underline */}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-200 ${
                  isActiveLink(item.path) 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle className="text-slate-600 hover:text-slate-800" />
            
            {/* Language Switch (UI only, future-ready) */}
            <button 
              className="p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
              aria-label="Switch language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Primary CTA */}
            <Link to="/products">
              <Button variant="primary" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                View Products
              </Button>
            </Link>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="font-medium">{user.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/30 dark:border-slate-700/30 rounded-xl shadow-lg shadow-black/10 py-2">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {user.role === 'public' ? (
                          <User className="w-3 h-3 text-cyan-500" />
                        ) : (
                          <Shield className="w-3 h-3 text-orange-500" />
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role} User</span>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    {!isPublicUser() && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="glass-secondary" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle className="text-slate-600 hover:text-slate-800" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 space-y-2 border-t border-white/20 dark:border-slate-700/20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-b-xl">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActiveLink(item.path)
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Actions */}
            <div className="pt-4 border-t border-white/20 dark:border-slate-700/20 space-y-3">
              <button 
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                aria-label="Switch language"
              >
                <Globe className="w-5 h-5" />
                Language
              </button>
              
              <Link to="/products" className="block px-4">
                <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  View Products
                </Button>
              </Link>

              {/* Mobile Authentication */}
              {isAuthenticated ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link to="/profile">
                    <Button variant="glass-secondary" className="w-full flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      My Profile
                    </Button>
                  </Link>
                  
                  {!isPublicUser() && (
                    <Link to="/admin/dashboard">
                      <Button variant="glass-secondary" className="w-full flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="px-4 space-y-3">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="glass-secondary" className="w-full flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavigation;
