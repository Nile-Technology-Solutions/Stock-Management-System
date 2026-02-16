import { Component } from 'react';
import Button from './Button';
import { AlertTriangle, RefreshCw, Home } from '../icons';
import { isProduction, isDevelopment } from '../../config/env';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service in production
    if (isProduction()) {
      console.error('Error Boundary caught an error:', error, errorInfo);
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Error Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
              {/* Error Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
              </p>

              {/* Error Details (Development Only) */}
              {isDevelopment() && this.state.error && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-left">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Error Details (Development)
                  </h3>
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo.componentStack && (
                    <pre className="text-xs text-slate-600 dark:text-slate-400 mt-2 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  onClick={this.handleRetry}
                  className="flex-1 inline-flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={this.handleGoHome}
                  className="flex-1 inline-flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Support Information */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  If this problem persists, please contact our support team with error code: 
                  <span className="font-mono ml-1">
                    ERR-{Date.now().toString(36).toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
