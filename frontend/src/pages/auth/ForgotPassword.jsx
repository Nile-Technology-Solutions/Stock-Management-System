import { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { authApi } from '../../services/authApi';
import {
  User,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Home,
  Mail
} from '../../components/icons';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authApi.forgotPassword(identifier);
      setSuccess(true);
      setResetInfo(result.data);
    } catch (err) {
      setError(err.message || 'Failed to process password reset request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-linear-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-linear-to-br from-emerald-400/5 to-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <GlassCard variant="standard" className="py-12 px-6 sm:px-10 text-center">
              <div className="w-20 h-20 bg-linear-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-400/25">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Reset Link Sent!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                If an account exists with {identifier}, you will receive password reset instructions.
              </p>

              {resetInfo?.resetToken && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                    Development Mode: Your reset token is:
                  </p>
                  <code className="text-xs bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded">
                    {resetInfo.resetToken}
                  </code>
                </div>
              )}
              
              <Link to="/login">
                <Button className="w-full">
                  Back to Login
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-linear-to-br from-cyan-400/5 to-sky-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-linear-to-br from-sky-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Login
          </Link>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-linear-to-br from-slate-900 to-slate-800 dark:from-cyan-400 dark:to-sky-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20 dark:shadow-cyan-400/20">
              <Mail className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Forgot Password?
            </h1>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Enter your email or phone number and we'll send you instructions to reset your password
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <GlassCard variant="standard" className="py-8 px-6 sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Email or Phone Number
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Enter your email or phone number"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
