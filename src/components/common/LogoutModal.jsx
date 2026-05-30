import { useEffect } from 'react';
import { CheckCircle, Zap } from '../icons';

const LogoutModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 2 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-sm animate-fadeIn pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 pointer-events-auto animate-scaleIn">
        {/* Futuristic Card */}
        <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 min-w-[320px] overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-sky-400/10 animate-pulse" />
          
          {/* Glowing orbs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Icon with animated ring */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full animate-ping opacity-20" />
              <div className="relative w-16 h-16 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/50">
                <CheckCircle className="w-8 h-8 text-white animate-checkmark" />
              </div>
            </div>
            
            {/* Text */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                Logout Successful
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You have been securely signed out
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full animate-progress shadow-lg shadow-cyan-400/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
