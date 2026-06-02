import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { redirectByRole } from '../../utils/roleUtils';
import Button from '../../components/common/Button';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  AlertTriangle,
  Home,
  Sparkles,
  Phone
} from '../../components/icons';

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      logout(false);
      const response = await authApi.login(credentials.identifier, credentials.password);
      const userObj = response.user || response.data?.user || response.data || response;
      const userRole = userObj.role || response.role || 'Customer';
      const destination = redirectByRole(userRole);

      login({
        ...userObj,
        token: response.token || response.data?.token || response.authToken
      });
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex relative">
      {/* ─── Left Panel: Brand Section ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Light gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-orange-400/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Top logo area */}
          <div>
            <div className="flex items-center gap-4 mb-16">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-2 ring-2 ring-white/20">
                <img src="/src/assets/LOGO.png" alt="AddHomes" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">AddHomes<span className="text-amber-400"> Creatives</span></h2>
                <p className="text-sm text-amber-200/70 font-medium tracking-wider uppercase">Furniture & Interiors</p>
              </div>
            </div>
          </div>

          {/* Center quote */}
          <div className="space-y-6 max-w-md">
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" />
            <h3 className="text-4xl font-bold text-white leading-tight">
              Crafting spaces<br />
              <span className="text-amber-300">you'll love</span>
            </h3>
            <p className="text-lg text-amber-100/70 leading-relaxed">
              Sign in to manage your orders, track production, and explore our premium collection of custom furniture and interior solutions.
            </p>
          </div>

          {/* Bottom */}
          <div className="flex items-center gap-4 text-sm text-amber-200/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>All systems secure</span>
            </div>
            <span className="text-amber-200/30">|</span>
            <span>Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo - only visible on small screens */}
          <div className="lg:hidden mb-10 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 dark:bg-slate-800 p-1.5 ring-2 ring-amber-200 dark:ring-amber-800">
                <img src="/src/assets/LOGO.png" alt="AddHomes" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">AddHomes <span className="text-amber-600 dark:text-amber-400">Creatives</span></h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest">Furniture & Interiors</p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-8 group">
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Sign in to your AddHomes account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email / Phone */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="identifier" name="identifier" type="text" autoComplete="username" required
                  value={credentials.identifier} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="name@example.com or +251..."
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                  value={credentials.password} onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-base rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs font-semibold text-slate-400 bg-white dark:bg-slate-950 uppercase tracking-wider">New here?</span>
            </div>
          </div>

          {/* Register */}
          <Link to="/register" className="block w-full py-3.5 text-center text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800/40 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200">
            Create an account
          </Link>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;