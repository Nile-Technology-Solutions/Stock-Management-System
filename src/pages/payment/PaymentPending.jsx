import { Link } from 'react-router-dom';

const PaymentPending = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-yellow-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Payment Pending</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Your payment is being processed. This may take a few moments. Please do not close this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/order-tracking"
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-sky-400 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-cyan-400/30"
          >
            Check Order Status
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
