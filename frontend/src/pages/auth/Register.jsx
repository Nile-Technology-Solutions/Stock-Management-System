import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Home,
  UserPlus,
  Check,
  X
} from '../../components/icons';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return '';
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-amber-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-slate-200';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please use a stronger password with at least 8 characters, including uppercase, lowercase, and numbers.');
      setLoading(false);
      return;
    }

    try {
      // Call actual API endpoint
      await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'Customer' // Default role for registration
      });

      setSuccess(true);
      
      // Auto-login after successful registration
      setTimeout(async () => {
        try {
          const loginResponse = await authApi.login(formData.email, formData.password);
          login({
            ...loginResponse.user,
            token: loginResponse.token
          });
          navigate('/', { replace: true });
        } catch {
          // If auto-login fails, redirect to login page
          navigate('/login', { replace: true });
        }
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      // Handle different error formats
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'One number', met: /[0-9]/.test(formData.password) },
    { text: 'One special character', met: /[^A-Za-z0-9]/.test(formData.password) }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950 relative overflow-hidden flex items-center justify-center px-3 sm:px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-400/5 to-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8 relative z-10 w-full max-w-md mx-auto">
          <div className="px-4">
            <GlassCard variant="standard" className="py-8 sm:py-12 px-4 sm:px-10 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/20">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Account Created Successfully!
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Welcome to AddHomes Creatives! Your account has been created and you're being signed in automatically.
              </p>
              
              <div className="flex justify-center">
                <div className="flex space-x-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce"
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

      <div className="flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8 relative z-10 w-full max-w-xl mx-auto">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full mb-4 sm:mb-6">
            <UserPlus className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Join AddHomes Creatives</span>
          </div>
          
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/20">
            <span className="text-2xl sm:text-3xl font-black text-white">AH</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Join AddHomes Creatives and start exploring premium furniture and interior solutions
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

              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    placeholder="+251912345678"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Include country code (e.g., +251 for Ethiopia)
                </p>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Password Strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength <= 2 ? 'text-red-600' : 
                        passwordStrength <= 3 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        )}
                        <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-red-500" />
                        <span className="text-red-600 dark:text-red-400 font-medium">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || passwordStrength < 3 || formData.password !== formData.confirmPassword}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                  size="large"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base font-bold">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating your account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Create Account
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

            {/* Sign In Link */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Already have an account?
                </p>
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/60 text-amber-700 dark:text-amber-400 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/10 group text-sm"
                >
                  Sign In Instead
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-400/10 to-orange-400/10 border border-amber-400/20 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Secure Registration</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2">
                Your information is encrypted and secure. We never share your personal data with third parties.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Register;