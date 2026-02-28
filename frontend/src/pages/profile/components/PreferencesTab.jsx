import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { profileApi } from '../../../services/profileApi';

const PreferencesTab = () => {
  const { theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    newsletter: false,
    language: 'en',
    currency: 'ETB',
    paymentMethod: 'Chapa'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await profileApi.getPreferences();
      if (response.data?.preferences) {
        setPreferences(prev => ({ ...prev, ...response.data.preferences }));
      }
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPreferences(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await profileApi.updatePreferences(preferences);
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save preferences' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Appearance</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Theme Mode</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose your preferred color scheme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-16 h-8 bg-slate-300 dark:bg-slate-600 rounded-full transition-colors duration-200"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-8' : ''
              }`}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Notifications</h2>
        
        {message.text && (
          <div className={`mb-4 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications via email
              </p>
            </div>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={preferences.emailNotifications}
              onChange={handleChange}
              className="w-5 h-5 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">SMS Notifications</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications via SMS
              </p>
            </div>
            <input
              type="checkbox"
              name="smsNotifications"
              checked={preferences.smsNotifications}
              onChange={handleChange}
              className="w-5 h-5 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Order Updates</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get notified about order status changes
              </p>
            </div>
            <input
              type="checkbox"
              name="orderUpdates"
              checked={preferences.orderUpdates}
              onChange={handleChange}
              className="w-5 h-5 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Promotional Emails</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive special offers and promotions
              </p>
            </div>
            <input
              type="checkbox"
              name="promotionalEmails"
              checked={preferences.promotionalEmails}
              onChange={handleChange}
              className="w-5 h-5 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Newsletter</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Subscribe to our newsletter
              </p>
            </div>
            <input
              type="checkbox"
              name="newsletter"
              checked={preferences.newsletter}
              onChange={handleChange}
              className="w-5 h-5 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
            />
          </label>
        </div>
      </div>

      {/* Payment Preferences */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Payment Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preferred Payment Method
            </label>
            <select
              name="paymentMethod"
              value={preferences.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
              <option value="Chapa">Chapa</option>
              <option value="Telebirr">Telebirr</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={preferences.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
              <option value="ETB">Ethiopian Birr (ETB)</option>
              <option value="USD">US Dollar (USD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default PreferencesTab;
