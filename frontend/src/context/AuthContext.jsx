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
    const storedUser = localStorage.getItem('sms_user');
    const storedToken = localStorage.getItem('sms_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({ ...userData, token: storedToken });
        setShowLogoutModal(false); // Ensure modal is hidden when restoring session
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('sms_user');
        localStorage.removeItem('sms_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Map fullName → name (mock API uses fullName, real API may use name)
    const resolvedName = userData.name || userData.fullName || (userData.email ? userData.email.split('@')[0] : 'User');
    const resolvedRole = userData.role || 'Customer';

    const userWithDefaults = {
      ...userData,
      id: userData.id || Date.now(),
      email: userData.email || '',
      name: resolvedName,
      role: resolvedRole,
      token: userData.token || `mock_token_${Date.now()}`,
      loginTime: new Date().toISOString(),
    };

    setUser(userWithDefaults);
    setShowLogoutModal(false); // Ensure modal is hidden on login
    localStorage.setItem('sms_user', JSON.stringify({
      id: userWithDefaults.id,
      email: userWithDefaults.email,
      name: userWithDefaults.name,
      role: userWithDefaults.role,
      loginTime: userWithDefaults.loginTime
    }));
    localStorage.setItem('sms_token', userWithDefaults.token);
  };

  const logout = (showModal = true) => {
    setUser(null);
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_token');
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
