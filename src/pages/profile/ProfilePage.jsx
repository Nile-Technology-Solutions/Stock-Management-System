import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import PersonalInfoTab from './components/PersonalInfoTab';
import PurchaseHistoryTab from './components/PurchaseHistoryTab';
import AddressesTab from './components/AddressesTab';
import PreferencesTab from './components/PreferencesTab';
import NotificationsTab from './components/NotificationsTab';
import FeedbackTab from './components/FeedbackTab';
import SupportTab from './components/SupportTab';
import Loader from '../../components/common/Loader';
import { profileApi } from '../../services/profileApi';

const ProfilePage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileApi.getProfile();
      
      // Handle different response structures
      const userData = response.data?.user || response.user || null;
      
      if (userData) {
        setProfileData(userData);
      } else {
        // Fallback to auth context user if API fails
        setProfileData(user);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.message || 'Failed to load profile data');
      // Fallback to auth context user
      setProfileData(user);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await profileApi.updateProfile(updatedData);
      setProfileData(response.data?.user || response.user);
      return { success: true };
    } catch (err) {
      console.error('Failed to update profile:', err);
      return { success: false, error: err.message };
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'purchases', label: 'Purchase History', icon: '🛍️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'support', label: 'Support', icon: '🆘' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Loader size="large" text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Futuristic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <ProfileHeader 
          profileData={profileData} 
          onRefresh={loadProfileData}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Tabs Navigation */}
        <ProfileTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              profileData={profileData} 
              onUpdate={handleProfileUpdate}
              onRefresh={loadProfileData}
            />
          )}
          {activeTab === 'purchases' && (
            <PurchaseHistoryTab profileData={profileData} />
          )}
          {activeTab === 'addresses' && (
            <AddressesTab profileData={profileData} />
          )}
          {activeTab === 'preferences' && (
            <PreferencesTab profileData={profileData} />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab profileData={profileData} />
          )}
          {activeTab === 'feedback' && (
            <FeedbackTab profileData={profileData} />
          )}
          {activeTab === 'support' && (
            <SupportTab profileData={profileData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
