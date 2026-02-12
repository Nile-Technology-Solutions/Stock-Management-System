import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('sms_user');
    const storedToken = localStorage.getItem('sms_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({ ...userData, token: storedToken });
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('sms_user');
        localStorage.removeItem('sms_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithDefaults = {
      id: userData.id || Date.now(),
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      role: userData.role || 'admin',
      token: userData.token || `mock_token_${Date.now()}`,
      loginTime: new Date().toISOString(),
      ...userData
    };

    setUser(userWithDefaults);
    localStorage.setItem('sms_user', JSON.stringify({
      id: userWithDefaults.id,
      email: userWithDefaults.email,
      name: userWithDefaults.name,
      role: userWithDefaults.role,
      loginTime: userWithDefaults.loginTime
    }));
    localStorage.setItem('sms_token', userWithDefaults.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_token');
  };

  const isAuthenticated = !!user && !!user.token;

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'public': 0,
      'admin': 1,
      'super_admin': 2
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const isPublicUser = () => {
    return user && user.role === 'public';
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    hasRole,
    isPublicUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
