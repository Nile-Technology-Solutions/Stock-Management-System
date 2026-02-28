import { useState, useEffect } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import { 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  Database, 
  Terminal, 
  Save, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Download,
  Upload
} from '../../../components/icons';
import { 
  getSystemSettings, 
  updateSystemSettings, 
  resetSettingsToDefaults,
  exportSettings,
  importSettings
} from './SettingsService';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Failed to load system settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateSystemSettings(settings);
      setMessage({ type: 'success', text: 'System settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to update system settings. Please check your inputs.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setSaving(true);
      try {
        const defaults = await resetSettingsToDefaults();
        setSettings(defaults);
        setMessage({ type: 'success', text: 'Settings reset to defaults successfully!' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to reset settings.' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportSettings('json');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sms-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export settings.' });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imported = await importSettings(file);
      setSettings(imported);
      setMessage({ type: 'success', text: 'Settings imported and applied successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to import settings: ${error.message}` });
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size="large" />
        <p className="mt-4 text-slate-500 dark:text-slate-400 animate-pulse">Initializing system configuration...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'backup', label: 'Backup', icon: <Database className="w-4 h-4" /> },
    { id: 'api', label: 'Developer/API', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            System Configuration
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Global settings controlling the entire platform's behavior
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="glass-secondary" onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <div className="relative">
            <input type="file" id="import-settings" className="hidden" accept=".json" onChange={handleImport} />
            <Button variant="glass-secondary" onClick={() => document.getElementById('import-settings').click()} className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Import
            </Button>
          </div>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-slide-up ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
          
          <div className="pt-6">
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="font-medium">Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <GlassCard className="p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-500" />
                    General Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        value={settings.general.companyName}
                        onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        value={settings.general.companyEmail}
                        onChange={(e) => handleInputChange('general', 'companyEmail', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        value={settings.general.companyPhone}
                        onChange={(e) => handleInputChange('general', 'companyPhone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Base Currency</label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        value={settings.general.currency}
                        onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                      >
                        <option value="ETB">Ethiopian Birr (ETB)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Office Address</label>
                    <textarea
                      rows="3"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      value={settings.general.companyAddress}
                      onChange={(e) => handleInputChange('general', 'companyAddress', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-pink-500" />
                    Internal Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive system alerts via email' },
                      { id: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Notify admins when inventory falls below threshold' },
                      { id: 'orderNotifications', label: 'Order Updates', desc: 'Real-time alerts for new orders' },
                      { id: 'paymentAlerts', label: 'Payment Transactions', desc: 'Notifications for successful payments' },
                      { id: 'systemAlerts', label: 'Critical System Alerts', desc: 'Security and health monitoring alerts' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.notifications[item.id]}
                            onChange={(e) => handleInputChange('notifications', item.id, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    Security & Authentication
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Min Password Length</label>
                      <input
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">System Audit Logging</p>
                        <p className="text-xs text-slate-500">Track all sensitive operations for security review</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.security.auditLog}
                          onChange={(e) => handleInputChange('security', 'auditLog', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    Data Continuity & Backup
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Backup Frequency</label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        value={settings.backup.backupFrequency}
                        onChange={(e) => handleInputChange('backup', 'backupFrequency', e.target.value)}
                      >
                        <option value="hourly">Every Hour</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Retention Period (days)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        value={settings.backup.retentionPeriod}
                        onChange={(e) => handleInputChange('backup', 'retentionPeriod', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">Storage Health</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">92% Space Available</p>
                      <p className="text-xs text-slate-500 mt-1">Last successful backup: {new Date(settings.backup.lastBackup).toLocaleString()}</p>
                    </div>
                    <Button variant="secondary" className="bg-white dark:bg-slate-800">
                      Force Manual Backup
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-500" />
                    Developer & API Access
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">API Version</label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-200 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-500"
                        value={settings.api.apiVersion}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rate Limit (requests/hour)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        value={settings.api.rateLimit}
                        onChange={(e) => handleInputChange('api', 'rateLimit', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'corsEnabled', label: 'CORS Headers' },
                      { id: 'swaggerEnabled', label: 'Swagger Documentation' },
                      { id: 'mockDataEnabled', label: 'Development Mock Data' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-2xl">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.api[item.id]}
                            onChange={(e) => handleInputChange('api', item.id, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
