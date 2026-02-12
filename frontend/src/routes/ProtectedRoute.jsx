import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Unauthorized from '../pages/auth/Unauthorized';

const ProtectedRoute = ({ children, requiredRole = 'admin', redirectTo = '/login' }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-8 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  if (!hasRole(requiredRole)) {
    // Show unauthorized page instead of redirecting
    return <Unauthorized />;
  }
  
  return children;
};

export default ProtectedRoute;