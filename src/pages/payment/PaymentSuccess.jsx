import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../../services/paymentApi';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (txRef) {
      verifyPayment();
    } else {
      setVerifying(false);
      setVerified(true); // Show success anyway if no tx_ref (manual navigation)
    }
  }, [txRef]);

  const verifyPayment = async () => {
    try {
      setVerifying(true);
      setError('');
      const response = await paymentApi.verifyPayment(txRef);
      setPaymentData(response.data || response);
      setVerified(true);
    } catch (err) {
      console.error('Payment verification failed:', err);
      setError(err.message || 'Payment verification failed');
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Verifying Payment...</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Please wait while we confirm your payment with Chapa.
          </p>
        </div>
      </div>
    );
  }

  // Error / failed state
  if (error || !verified) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Payment Verification Failed</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error || 'We were unable to verify your payment. This may be temporary.'}
          </p>
          {txRef && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-6 font-mono">
              Reference: {txRef}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={verifyPayment}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-sky-400 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-cyan-400/30"
            >
              Retry Verification
            </button>
            <Link
              to="/order-tracking"
              className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              Check Order Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  const payment = paymentData?.payment;
  const order = paymentData?.order;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Payment Successful!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-2">
          Your payment has been verified and confirmed.
        </p>

        {/* Payment details */}
        {(payment || order || orderId) && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700 text-left mt-6">
            {(order?.id || orderId) && (
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Order</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">#{order?.id || orderId}</span>
              </div>
            )}
            {order?.productName && (
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Product</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.productName}</span>
              </div>
            )}
            {payment?.amount && (
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Amount Paid</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{payment.amount} ETB</span>
              </div>
            )}
            {order?.status && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                <span className="text-xs font-semibold px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">{order.status}</span>
              </div>
            )}
            {txRef && (
              <div className="flex justify-between py-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Reference</span>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{txRef}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/order-tracking"
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-sky-400 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-cyan-400/30"
          >
            Track Order
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
