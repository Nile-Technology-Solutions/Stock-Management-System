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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'News', path: '/news' },
    { name: 'Track Order', path: '/order-tracking' }
  ];

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-amber-900/5 border-b border-amber-100/60 dark:border-amber-900/20'
          : 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-white/20 dark:border-slate-800/30'
      }`}
    >
      {/* Amber accent top bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">

          {/* ─── Logo ─── */}
          <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0">
            {/* Logo image container */}
            <div className="relative">
              {/* Ambient glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-all duration-500" />
              {/* Main container */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-lg shadow-amber-200/60 dark:shadow-amber-900/30 ring-2 ring-amber-200/50 dark:ring-amber-700/30 group-hover:ring-amber-400/70 group-hover:scale-105 transition-all duration-300">
                <img
                  src="/src/assets/LOGO.png"
                  alt="AddHomes Creatives Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              {/* Live dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </div>

            {/* Brand text */}
            <div className="flex flex-col leading-tight">
              <span className="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                AddHomes <span className="text-amber-600 dark:text-amber-400">Creatives</span>
              </span>
              <span className="text-[10px] italic font-medium text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-0.5">
                Furniture &amp; Interiors
              </span>
            </div>
          </Link>

          {/* ─── Desktop Nav Links ─── */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                  isActiveLink(item.path)
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/60 dark:hover:bg-amber-900/10'
                }`}
              >
                {item.name}
                {/* Active underline dot */}
                {isActiveLink(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* ─── Desktop Actions ─── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Shop CTA */}
            <Link to="/products">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200">
                <ShoppingBag className="w-4 h-4" />
                View Products
              </button>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-300" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-semibold hidden lg:block">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-black/10 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {user.role === 'public' ? (
                          <User className="w-3 h-3 text-amber-500" />
                        ) : (
                          <Shield className="w-3 h-3 text-orange-500" />
                        )}
                        <span className="text-xs text-slate-400 capitalize">{user.role} Account</span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-700 transition-colors duration-150"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    {!isPublicUser() && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-700 transition-colors duration-150"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 text-sm font-bold transition-all duration-200"
                >
                  <User className="w-3.5 h-3.5" /> Register
                </Link>
              </div>
            )}

            {/* Theme Toggle — top right, after a divider */}
            <div className="border-l border-slate-200 dark:border-slate-700 pl-3 ml-1">
              <ThemeToggle />
            </div>
          </div>

          {/* ─── Mobile: Hamburger + Theme ─── */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl transition-all duration-200 hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu ─── */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-3 border-t border-amber-100 dark:border-slate-800 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActiveLink(item.path)
                    ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm border border-amber-200/50 dark:border-amber-800/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {isActiveLink(item.path) && (
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                )}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="mt-4 pt-4 border-t border-amber-100 dark:border-slate-800 px-1 space-y-3">
            <Link to="/products" className="block">
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/25">
                <ShoppingBag className="w-4 h-4" />
                View Products
              </button>
            </Link>

            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-slate-800/60 rounded-xl border border-amber-100 dark:border-slate-700">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile">
                  <Button variant="glass-secondary" className="w-full flex items-center justify-center gap-2">
                    <User className="w-4 h-4" /> My Profile
                  </Button>
                </Link>
                {!isPublicUser() && (
                  <Link to="/admin/dashboard">
                    <Button variant="glass-secondary" className="w-full flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login">
                  <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:border-amber-400 hover:text-amber-600 transition-all duration-200">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all duration-200">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavigation;
