import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { resolveImageUrl } from '../../utils/imageUrl';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const orderStatuses = [
    { key: 'OrderSubmitted', label: 'Order Submitted', icon: '📝' },
    { key: 'PaymentConfirmed', label: 'Payment Confirmed', icon: '✅' },
    { key: 'UnderProcess', label: 'Under Production', icon: '⚙️' },
    { key: 'Completed', label: 'Production Complete', icon: '🏭' },
    { key: 'ReadyForDelivery', label: 'Ready for Delivery', icon: '📦' },
    { key: 'Delivered', label: 'Delivered', icon: '🎉' },
  ];

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const data = await orderApi.trackOrder(orderId);
      setOrderData(data);
    } catch (err) {
      setError(err.message);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };


  const getStatusIndex = (status) => {
    if (status === 'Rejected') return -1;
    return orderStatuses.findIndex(s => s.key === status);
  };

  const currentStatusIndex = orderData ? getStatusIndex(orderData.status) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-sky-50/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Enter your order ID to check the status of your order
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID (e.g., ORD-12345)"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
            />
            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-500 hover:to-sky-500 shadow-lg shadow-cyan-400/30"
            >
              Track Order
            </Button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader size="large" text="Tracking your order..." />
          </div>
        )}

        {/* Error State */}
        {error && searched && !loading && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <ErrorState
              message={error}
              onRetry={() => handleTrackOrder({ preventDefault: () => { } })}
            />
          </div>
        )}

        {/* Order Details */}
        {orderData && !loading && (
          <div className="space-y-6">
            {/* Order Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Order #{orderData.orderId || orderData.id}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Placed on {orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm ${orderData.status === 'Completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : orderData.status === 'Rejected'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
                  }`}>
                  {orderData.status}
                </div>
              </div>

              {/* Customer Details */}
              {orderData.customerName && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Customer Name</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{orderData.customerName}</p>
                  </div>
                  {orderData.customerEmail && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{orderData.customerEmail}</p>
                    </div>
                  )}
                  {orderData.customerPhone && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{orderData.customerPhone}</p>
                    </div>
                  )}
                  {orderData.deliveryAddress && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Delivery Address</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{orderData.deliveryAddress}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Production Progress & Photos (for custom orders under production) */}
            {orderData.productionRecord && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Production Progress</h3>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="font-semibold text-cyan-600">{orderData.productionRecord.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-sky-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${orderData.productionRecord.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>

                {orderData.productionRecord.workInstructions && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Work Details</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{orderData.productionRecord.workInstructions}</p>
                  </div>
                )}

                {/* Production Photos */}
                {orderData.productionRecord.photos && orderData.productionRecord.photos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Production Photos</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {orderData.productionRecord.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={resolveImageUrl(photo.url)}
                          alt={`Production update ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Info & Final Payment Button */}
            {orderData.isCustom && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Total Price</span>
                    <span className="font-medium">ETB {orderData.totalPrice ? Number(orderData.totalPrice).toLocaleString() : '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Deposit Paid</span>
                    <span className="font-medium text-green-600">ETB {orderData.depositAmount ? Number(orderData.depositAmount).toLocaleString() : '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t pt-2">
                    <span>Remaining</span>
                    <span className="text-amber-600">
                      ETB {orderData.totalPrice && orderData.depositAmount
                        ? (Number(orderData.totalPrice) - Number(orderData.depositAmount)).toLocaleString()
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Pay Remaining button when production is complete */}
                {orderData.status === 'Completed' && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">Production is complete! Pay the remaining amount to proceed to delivery.</p>
                    <Button
                      variant="primary"
                      size="large"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      onClick={() => navigate(`/payment?orderId=${orderData.id}&type=final`)}
                    >
                      Pay Remaining ETB {orderData.totalPrice && orderData.depositAmount
                        ? (Number(orderData.totalPrice) - Number(orderData.depositAmount)).toLocaleString()
                        : ''}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Status Timeline */}
            {orderData.status !== 'Cancelled' ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-8">
                  Order Progress
                </h3>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                  <div
                    className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-cyan-400 to-sky-400 transition-all duration-500"
                    style={{ height: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%` }}
                  />

                  {/* Status Steps */}
                  <div className="space-y-8">
                    {orderStatuses.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div key={status.key} className="relative flex items-start gap-4">
                          {/* Icon */}
                          <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${isCompleted
                              ? 'bg-gradient-to-br from-cyan-400 to-sky-400 border-white dark:border-slate-900 shadow-lg'
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                            }`}>
                            <span className="text-xl">{status.icon}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-2">
                            <h4 className={`text-lg font-semibold ${isCompleted
                                ? 'text-slate-900 dark:text-slate-100'
                                : 'text-slate-500 dark:text-slate-400'
                              }`}>
                              {status.label}
                            </h4>
                            {isCurrent && (
                              <p className="text-sm text-cyan-600 dark:text-cyan-400 mt-1 font-medium">
                                Current Status
                              </p>
                            )}
                          </div>

                          {/* Checkmark */}
                          {isCompleted && !isCurrent && (
                            <div className="text-green-500">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Cancelled Status */
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                  Order Cancelled
                </h3>
                <p className="text-red-600 dark:text-red-400">
                  This order has been cancelled. Please contact support for more information.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!orderData && !loading && !error && searched && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No Order Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Please check your order ID and try again
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
