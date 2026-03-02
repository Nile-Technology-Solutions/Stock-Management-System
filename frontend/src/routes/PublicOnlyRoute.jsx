import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { redirectByRole } from '../utils/roleUtils';

/**
 * PublicOnlyRoute Component
 * Prevents authenticated users from accessing public-only pages (like login/register)
 * Automatically redirects logged-in users to their role-based dashboard
 * 
 * @param {React.ReactNode} children - Child components to render if not authenticated
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-lg shadow-black/5 p-8 text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is authenticated, always redirect to their role-based dashboard
  if (isAuthenticated && user) {
    return <Navigate to={redirectByRole(user.role)} replace />;
  }
  
  // User is not authenticated, show the public page
  return children;
};

export default PublicOnlyRoute;
