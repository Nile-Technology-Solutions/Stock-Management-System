import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { paymentApi } from '../../services/paymentApi';

const PaymentInitialization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  // Get orderId from location state or URL params
  const orderData = location.state || {};
  const orderId = orderData.orderId;

  const handlePay = async () => {
    if (!orderId) {
      setError('No order ID found. Please place an order first.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await paymentApi.initiatePayment({ orderId: parseInt(orderId) });
      const checkoutUrl = response.data?.checkoutUrl || response.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error('No checkout URL received from payment gateway');
      }

      // Redirect to Chapa checkout page
      setRedirecting(true);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  // Auto-initiate if we have orderId and autoInitiate flag
  useEffect(() => {
    if (orderData.autoInitiate && orderId) {
      handlePay();
    }
  }, []);

  if (redirecting) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Redirecting to Chapa...</h1>
          <p className="text-slate-600 dark:text-slate-400">
            You are being redirected to our secure payment partner. Please do not close this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Complete Payment</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {orderId
              ? `Pay for Order #${orderId} via Chapa secure payment gateway.`
              : 'No order selected for payment.'
            }
          </p>

          {/* Order summary if available */}
          {orderData.totalPrice && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Amount</span>
                <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{orderData.totalPrice} ETB</span>
              </div>
              {orderData.productName && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{orderData.productName}</p>
              )}
            </div>
          )}

          {/* Payment method info */}
          <div className="mb-6">
            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20">
              <div className="w-5 h-5 rounded-full border-2 border-cyan-500 flex items-center justify-center flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Chapa</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pay with Chapa — Visa, Mastercard, Mobile Money & more</p>
              </div>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured by Chapa with bank-level encryption</span>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={processing || !orderId}
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-sky-400 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-cyan-400/30 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting to Chapa...
              </>
            ) : (
              'Proceed to Pay with Chapa'
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
