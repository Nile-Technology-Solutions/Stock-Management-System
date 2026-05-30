import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { redirectByRole } from '../../utils/roleUtils';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Home
} from '../../components/icons';

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clear any stale previous session BEFORE logging in (without showing modal)
      logout(false);

      // Call actual API endpoint
      const response = await authApi.login(credentials.identifier, credentials.password);

      // Robust role detection - check common nesting patterns
      const userObj = response.user || response.data?.user || response.data || response;
      const userRole = userObj.role || response.role || 'Customer';

      console.log('Login successful. Detected role:', userRole);

      // Determine where to redirect based purely on the returned role
      const destination = redirectByRole(userRole);

      // Store token and user data
      login({
        ...userObj,
        token: response.token || response.data?.token || response.authToken
      });

      // Navigate to the role-specific dashboard
      navigate(destination, { replace: true });

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleDemoLogin = () => {
    // Demo login removed - use real credentials only
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950 relative overflow-hidden flex items-center justify-center px-3 sm:px-4">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-amber-400/8 to-orange-400/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-orange-400/8 to-amber-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-400/2 via-transparent to-orange-400/2 rounded-full blur-3xl animate-spin" style={{ animationDuration: '60s' }} />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-orange-400/40 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-amber-300/20 rounded-full animate-ping" style={{ animationDelay: '5s' }} />
      </div>

      <div className="flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8 relative z-10 w-full max-w-lg mx-auto">
        {/* Back to Home */}
        <div className="mb-6 sm:mb-8 px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 group text-sm font-medium"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>

        {/* Premium Header */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          {/* Logo Mark */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full mb-4 sm:mb-6">
            <Shield className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Secure Login</span>
          </div>

          {/* Brand Icon */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/20">
            <span className="text-2xl sm:text-3xl font-black text-white">AH</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Sign in to your account to continue with AddHomes Creatives
          </p>
        </div>

        <div className="px-3 sm:px-4 w-full">
          <GlassCard variant="standard" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 w-full">

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Email / Phone */}
              <div className="space-y-1.5">
                <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={credentials.identifier}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password"
                    className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                  size="large"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base font-bold">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing you in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </span>
                  {!loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                </Button>
              </div>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  New to AddHomes Creative Woodworks?
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/60 text-amber-700 dark:text-amber-400 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/10 group text-sm"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Login;