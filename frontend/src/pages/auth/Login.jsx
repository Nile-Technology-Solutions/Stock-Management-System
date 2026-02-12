import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
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
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call actual API endpoint
      const response = await authApi.login(credentials.username, credentials.password);
      
      // Store token and user data
      login({
        ...response.user,
        token: response.token
      });
      
      // Redirect based on user role
      const from = location.state?.from?.pathname || 
        (response.user.role === 'Customer' ? '/' : '/admin/dashboard');
      navigate(from, { replace: true });
      
    } catch (err) {
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

  const handleDemoLogin = (demoUser) => {
    setCredentials({
      username: demoUser.username,
      password: demoUser.password
    });
  };

  // Demo accounts for testing (these should exist in your backend)
  const demoAccounts = [
    { 
      username: 'demo_customer', 
      password: 'demo123', 
      role: 'Customer', 
      name: 'Demo Customer',
      description: 'Browse products and place orders'
    },
    { 
      username: 'admin_user', 
      password: 'admin123', 
      role: 'Admin', 
      name: 'Admin User',
      description: 'Manage inventory and orders'
    },
    { 
      username: 'super_admin', 
      password: 'super123', 
      role: 'Super Admin', 
      name: 'Super Admin',
      description: 'Full system access'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-sky-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-sky-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/2 via-transparent to-sky-400/2 rounded-full blur-3xl animate-spin" style={{ animationDuration: '60s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-sky-400/40 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-cyan-300/20 rounded-full animate-ping" style={{ animationDelay: '5s' }} />
      </div>

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Back to Home */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>

        {/* Enhanced Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-sky-400/10 border border-cyan-400/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-cyan-600 animate-pulse" />
              <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Secure Login</span>
            </div>
            
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-cyan-400 dark:to-sky-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20 dark:shadow-cyan-400/20">
              <span className="text-3xl font-semibold text-white">SMS</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Sign in to your account to continue your journey with SMS Nile Tech
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <GlassCard variant="standard" className="py-8 px-6 sm:px-10">
            {/* Demo Credentials */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Demo Accounts</h3>
              </div>
              <div className="space-y-3">
                {demoAccounts.map((demo) => (
                  <button
                    key={demo.username}
                    type="button"
                    onClick={() => handleDemoLogin(demo)}
                    className="w-full text-left p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-400/50 transition-all duration-200 hover:scale-105 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        demo.role === 'Super Admin' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                        demo.role === 'Admin' ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                        'bg-gradient-to-r from-cyan-400 to-sky-400'
                      } text-white shadow-lg`}>
                        {demo.role === 'Customer' ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
                          {demo.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {demo.username}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {demo.description}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Enter your username"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden"
                  size="large"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing you in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </span>
                  {!loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 backdrop-blur-sm rounded-full">
                    New to SMS Nile Tech?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-cyan-400/50 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-400/10 group"
                >
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400/10 to-emerald-400/10 border border-green-400/20 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">API Connected</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Connected to backend API. Use the demo accounts above or your registered credentials.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Login;
