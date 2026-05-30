import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, hasRoleAccess, isClient } from '../utils/roleUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('ah_user');
    const storedToken = localStorage.getItem('ah_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({ ...userData, token: storedToken });
        setShowLogoutModal(false); // Ensure modal is hidden when restoring session
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('ah_user');
        localStorage.removeItem('ah_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Backend returns fullName, map it to name for consistency
    // Also check for username as fallback
    const resolvedName = userData.fullName || userData.name || userData.username || (userData.email ? userData.email.split('@')[0] : 'User');
    const resolvedRole = userData.role || 'Customer';

    const userWithDefaults = {
      ...userData,
      id: userData.id || Date.now(),
      email: userData.email || '',
      username: userData.username || '',
      name: resolvedName,
      fullName: userData.fullName || resolvedName, // Keep fullName for compatibility
      role: resolvedRole,
      token: userData.token || `mock_token_${Date.now()}`,
      loginTime: new Date().toISOString(),
    };

    setUser(userWithDefaults);
    setShowLogoutModal(false); // Ensure modal is hidden on login
    localStorage.setItem('ah_user', JSON.stringify({
      id: userWithDefaults.id,
      email: userWithDefaults.email,
      username: userWithDefaults.username,
      name: userWithDefaults.name,
      fullName: userWithDefaults.fullName,
      role: userWithDefaults.role,
      loginTime: userWithDefaults.loginTime
    }));
    localStorage.setItem('ah_token', userWithDefaults.token);
  };

  const logout = (showModal = true) => {
    setUser(null);
    localStorage.removeItem('ah_user');
    localStorage.removeItem('ah_token');
    if (showModal) {
      setShowLogoutModal(true);
    }
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const isAuthenticated = !!user && !!user.token;

  const hasRole = (requiredRole) => {
    return hasRoleAccess(user?.role, requiredRole);
  };

  const isPublicUser = () => {
    return isClient(user?.role);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    hasRole,
    isPublicUser,
    showLogoutModal,
    closeLogoutModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
