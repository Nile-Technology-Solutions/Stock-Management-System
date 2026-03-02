import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, getRoleDisplayName, redirectByRole } from '../../utils/roleUtils';

const Unauthorized = () => {
  const { user, hasRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 py-8 px-6 sm:px-10">
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Content */}
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Access Denied
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
              You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
            </p>

            {/* User Info */}
            {user && (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Logged in as: <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Role: <span className="font-semibold text-slate-900 dark:text-slate-100">{getRoleDisplayName(user.role)}</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                to={user ? redirectByRole(user.role) : '/'}
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-400/20"
              >
                Go to Dashboard
              </Link>
              
              <Link
                to="/login"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-all duration-200"
              >
                Sign in with different account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Unauthorized;