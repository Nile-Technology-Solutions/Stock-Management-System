import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { authApi } from '../../services/authApi';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Home,
  Check,
  X
} from '../../components/icons';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please use a stronger password.');
      setLoading(false);
      return;
    }

    try {
      await authApi.resetPassword(token, formData.newPassword, formData.confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (error) setError('');
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.newPassword.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { text: 'One lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { text: 'One number', met: /[0-9]/.test(formData.newPassword) },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-linear-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <GlassCard variant="standard" className="py-12 px-6 sm:px-10 text-center">
              <div className="w-20 h-20 bg-linear-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-400/25">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Password Reset Successful!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Your password has been reset successfully. Redirecting to login...
              </p>
              
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
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
              <Lock className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Reset Your Password
            </h1>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Enter your new password below
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
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Enter new password"
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

                {formData.newPassword && (
                  <div className="mt-3 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400" />
                        )}
                        <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Confirm new password"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {formData.newPassword === formData.confirmPassword ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading || passwordStrength < 3 || formData.newPassword !== formData.confirmPassword}
                  className="w-full group relative overflow-hidden"
                  size="large"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password
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

export default ResetPassword;
