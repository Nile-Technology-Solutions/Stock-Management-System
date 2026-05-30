import { useEffect, useState } from 'react';
import { CheckCircle, Lock, ArrowRight } from '../../components/icons';

const PaymentRedirectNotice = ({ 
  onRedirect, 
  redirectDelay = 3000, 
  className = "" 
}) => {
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onRedirect) {
            onRedirect();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRedirect, redirectDelay]);

  return (
    <div className={`min-h-screen bg-slate-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Main Message */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Order Submitted Successfully
        </h2>
        
        <p className="text-slate-600 mb-6">
          You are being redirected to our secure payment partner to complete your order.
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
        <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
          <span>Redirecting in</span>
          <span className="inline-flex items-center justify-center w-8 h-8 bg-cyan-100 text-cyan-700 font-semibold rounded-full">
            {countdown}
          </span>
          <span>seconds</span>
        </div>

        {/* Loading Animation */}
        <div className="mt-6">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Manual Redirect Button */}
        <button
          onClick={onRedirect}
          className="mt-6 text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          Continue to Payment <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PaymentRedirectNotice;