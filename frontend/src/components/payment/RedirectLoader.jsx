import { useEffect, useState } from 'react';
import { Loader, Lock } from '../icons';

const RedirectLoader = ({ 
  message = "Redirecting to secure payment...",
  onComplete,
  delay = 3000,
  className = "" 
}) => {
  const [countdown, setCountdown] = useState(Math.ceil(delay / 1000));
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete, delay]);

  return (
    <div className={`min-h-screen bg-slate-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
        {/* Loading Icon */}
        <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
          <Loader className="w-8 h-8 text-cyan-600 animate-spin" />
        </div>

        {/* Main Message */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Processing Payment
        </h2>
        
        <p className="text-slate-600 mb-6">
          {message}
        </p>

        {/* Security Assurance */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-slate-600 mr-2" />
            <span className="text-sm font-medium text-slate-700">Secure Payment</span>
          </div>
          <p className="text-xs text-slate-600">
            Your payment information is protected with bank-level security encryption.
          </p>
        </div>

        {/* Countdown */}
        {!isComplete && (
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
            <span>Redirecting in</span>
            <span className="inline-flex items-center justify-center w-8 h-8 bg-cyan-100 text-cyan-700 font-semibold rounded-full">
              {countdown}
            </span>
            <span>seconds</span>
          </div>
        )}

        {/* Processing Animation */}
        <div className="mt-6">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-6 text-xs text-slate-500">
          <p>Please do not close this window or navigate away.</p>
        </div>
      </div>
    </div>
  );
};

export default RedirectLoader;