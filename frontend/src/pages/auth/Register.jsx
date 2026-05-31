import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  AlertTriangle,
  Home,
  CheckCircle,
  UserPlus,
  Check,
  X,
  Mail,
  Phone,
  Sparkles
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
      case 0: case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0: case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-emerald-500';
      case 5: return 'bg-green-500';
      default: return 'bg-slate-200';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Use at least 8 characters, uppercase, lowercase, and numbers.');
      setLoading(false);
      return;
    }

    try {
      await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'Customer'
      });

      setSuccess(true);

      setTimeout(async () => {
        try {
          const loginResponse = await authApi.login(formData.email, formData.password);
          login({ ...loginResponse.user, token: loginResponse.token });
          navigate('/', { replace: true });
        } catch {
          navigate('/login', { replace: true });
        }
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      if (err instanceof Error) errorMessage = err.message;
      else if (typeof err === 'string') errorMessage = err;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(checkPasswordStrength(value));
    if (error) setError('');
  };

  const passwordRequirements = [
    { text: '8+ characters', met: formData.password.length >= 8 },
    { text: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'One number', met: /[0-9]/.test(formData.password) },
    { text: 'Special character', met: /[^A-Za-z0-9]/.test(formData.password) }
  ];

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Account created!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Welcome to AddHomes Creatives. We're signing you in now...
          </p>
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex relative">
      {/* ─── Left Panel: Brand Section ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-stone-800 via-amber-900 to-stone-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-amber-400/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-400/8 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
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

          <div className="space-y-6 max-w-md">
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" />
            <h3 className="text-4xl font-bold text-white leading-tight">
              Join the<br />
              <span className="text-amber-300">community</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-amber-100/70 text-sm">Browse our full catalog of premium furniture</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-amber-100/70 text-sm">Track your orders and production in real-time</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-amber-100/70 text-sm">Get personalized design recommendations</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-amber-200/50">
            Based in Addis Ababa, Ethiopia
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Register Form ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-lg mx-auto">
          {/* Mobile logo */}
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

          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-8 group">
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Join AddHomes Creatives and discover premium furniture
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Abebe Kebede" />
              </div>
            </div>

            {/* Email & Phone - side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                    placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                    placeholder="+251 912 345 678" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">Include country code</p>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500 font-medium">Password strength</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-emerald-500'
                    }`}>{getPasswordStrengthText(passwordStrength)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }} />
                  </div>

                  {/* Requirements grid */}
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        )}
                        <span className={req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Shield className="w-4 h-4 text-slate-400" />
                </div>
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Repeat your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 text-red-500" />
                      <span className="text-red-500 font-medium">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || passwordStrength < 3 || formData.password !== formData.confirmPassword}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-base rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
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
              <span className="px-4 text-xs font-semibold text-slate-400 bg-white dark:bg-slate-950 uppercase tracking-wider">Already registered?</span>
            </div>
          </div>

          {/* Login */}
          <Link to="/login" className="block w-full py-3.5 text-center text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800/40 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200">
            Sign in instead
          </Link>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Your data is encrypted and secure. We never share your personal information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;