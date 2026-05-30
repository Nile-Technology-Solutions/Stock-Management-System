import { useState } from 'react';
import { X, RefreshCw, CheckCircle } from '../../../components/icons';
import Button from '../../../components/common/Button';
import { orderApi } from '../../../services/orderApi';

const OrderEditModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Define allowed status transitions based on current status
  const getAllowedStatuses = (currentStatus) => {
    const allStatuses = {
      'OrderSubmitted': [
        { value: 'PaymentConfirmed', label: 'Payment Confirmed', color: 'from-green-400 to-green-600', icon: '💳' },
        { value: 'Cancelled', label: 'Cancelled', color: 'from-red-400 to-red-600', icon: '❌' }
      ],
      'PaymentConfirmed': [
        { value: 'Cancelled', label: 'Cancelled', color: 'from-red-400 to-red-600', icon: '❌' }
      ],
      'UnderProcess': [],
      'Completed': [],
      'Cancelled': []
    };
    return allStatuses[currentStatus] || [];
  };

  const allowedStatuses = getAllowedStatuses(order.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const updatedOrder = await orderApi.updateOrder(order.id, { status });

      // Close modal first to prevent DOM errors
      onClose();

      // Then update the parent component
      setTimeout(() => {
        onUpdate(updatedOrder.data || updatedOrder);
      }, 100);
    } catch (err) {
      console.error('Failed to update order:', err);
      setError(err.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="shrink-0 relative bg-gradient-to-r from-cyan-400 to-sky-500 p-8 text-white rounded-t-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-5 w-24 h-24 border-4 border-white rounded-full animate-ping" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            disabled={updating}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Edit Order</h2>
            <p className="text-white/90">Update order status for #{order.id}</p>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Order Summary */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Customer</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.user?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Product</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.productName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Quantity</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {order.totalPrice ? `${order.totalPrice} ETB` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
              Select New Status
            </label>

            {allowedStatuses.length === 0 ? (
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                <p className="text-amber-700 dark:text-amber-400 font-semibold">
                  No status changes allowed for "{order.status}" orders
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-300 mt-2">
                  {order.status === 'UnderProcess' && 'Status will be automatically updated to "Completed" when production is finished.'}
                  {order.status === 'Completed' && 'This order has been completed.'}
                  {order.status === 'Cancelled' && 'This order has been cancelled.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allowedStatuses.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatus(s.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${status === s.value
                        ? `border-transparent bg-gradient-to-r ${s.color} text-white shadow-lg`
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-400'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div className="text-left">
                        <p className="font-bold text-sm">{s.label}</p>
                        {status === s.value && (
                          <CheckCircle className="w-4 h-4 absolute top-2 right-2" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Transition Rules */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold mb-2">Status Transition Rules:</p>
            <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
              <li>• Order Submitted → Payment Confirmed or Cancelled</li>
              <li>• Payment Confirmed → Under Process or Cancelled</li>
              <li>• Under Process → Completed (automatic via production)</li>
              <li>• Cancellation restores stock for ready-made orders</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400 font-semibold">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {allowedStatuses.length > 0 && (
              <Button
                type="submit"
                disabled={updating || status === order.status}
                className="flex-1"
                variant="primary"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            )}
            <Button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="flex-1"
              variant="secondary"
            >
              {allowedStatuses.length === 0 ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEditModal;
