import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isRoleAllowed } from '../utils/roleUtils';
import Unauthorized from '../pages/auth/Unauthorized';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role-based access control
 * 
 * @param {React.ReactNode} children - Child components to render if authorized
 * @param {Array<string>} allowedRoles - Array of roles that can access this route
 * @param {string} redirectTo - Where to redirect if not authenticated (default: '/login')
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-lg shadow-black/5 p-8 text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Check role-based access
  if (allowedRoles.length > 0 && !isRoleAllowed(user?.role, allowedRoles)) {
    // User is authenticated but doesn't have the required role
    return <Unauthorized />;
  }
  
  // User is authenticated and has proper role
  return children;
};

export default ProtectedRoute;