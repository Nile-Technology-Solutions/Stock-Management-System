import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const PaymentInitialization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('chapa');
  const [processing, setProcessing] = useState(false);

  const orderData = location.state || {};

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment initialization delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In production this would redirect to Chapa/Telebirr
    navigate('/payment/pending');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Complete Payment</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Select your preferred payment method to continue.</p>

          {/* Payment methods */}
          <div className="space-y-3 mb-8">
            {[
              { id: 'chapa', name: 'Chapa', description: 'Pay with Chapa — Visa, Mastercard & more' },
              { id: 'telebirr', name: 'Telebirr', description: 'Pay with Telebirr mobile wallet' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedMethod === method.id
                    ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedMethod === method.id ? 'border-cyan-500' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{method.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{method.description}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-sky-400 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-cyan-400/30 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              'Proceed to Pay'
            )}
          </button>

          <Link
            to="/products"
            className="block text-center mt-4 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Cancel and go back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentInitialization;
