import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { profileApi } from '../../../services/profileApi';

const ProfileHeader = ({ profileData, onRefresh }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      await profileApi.uploadProfilePicture(file);
      onRefresh();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-10"></div>
      
      <div className="relative p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {profileData?.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt={profileData.fullName || profileData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-cyan-500">
                    {getInitials(profileData?.fullName || profileData?.name)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 group-hover:scale-110">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {profileData?.fullName || profileData?.name || 'User'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-1">
              @{profileData?.username || 'username'}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              {profileData?.role || 'Customer'}
            </div>
            
            {uploadError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{uploadError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Home
            </button>
            <button
              onClick={() => logout()}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-cyan-500">
              {profileData?.totalOrders || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-blue-500">
              {profileData?.activeOrders || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Orders</div>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-purple-500">
              {profileData?.addresses?.length || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Addresses</div>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-green-500">
              {profileData?.memberSince ? new Date(profileData.memberSince).getFullYear() : new Date(profileData?.createdAt).getFullYear() || 'N/A'}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Member Since</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
