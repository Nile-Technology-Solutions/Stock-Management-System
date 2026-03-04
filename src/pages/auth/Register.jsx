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
        return 'bg-blue-500';
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-400/5 to-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <GlassCard variant="standard" className="py-12 px-6 sm:px-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-400/25">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Account Created Successfully!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Welcome to SMS Nile Tech! Your account has been created and you're being signed in automatically.
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
        <div className="sm:mx-auto sm:w-full sm:max-w-lg mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>

        {/* Enhanced Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-sky-400/10 border border-cyan-400/20 rounded-full mb-6">
              <UserPlus className="w-4 h-4 text-cyan-600 animate-pulse" />
              <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Join SMS Nile Tech</span>
            </div>
            
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-cyan-400 dark:to-sky-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20 dark:shadow-cyan-400/20">
              <span className="text-3xl font-semibold text-white">SMS</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Join thousands of customers who trust SMS Nile Tech for their furniture needs
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <GlassCard variant="standard" className="py-8 px-6 sm:px-10">
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
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Email Address
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="your.email@example.com"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Phone Number
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="+251912345678"
                  />
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Include country code (e.g., +251 for Ethiopia)
                </p>
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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Create a strong password"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Password Strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength <= 2 ? 'text-red-600' : 
                        passwordStrength <= 3 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
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
                    <Shield className="w-4 h-4" />
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
                    placeholder="Confirm your password"
                  />
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {formData.password === formData.confirmPassword ? (
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
                  disabled={loading || passwordStrength < 3 || formData.password !== formData.confirmPassword}
                  className="w-full group relative overflow-hidden"
                  size="large"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating your account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
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
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-cyan-400/50 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-400/10 group"
                >
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Sign In Instead
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-sky-400/10 border border-cyan-400/20 rounded-full">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Secure Registration</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
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
