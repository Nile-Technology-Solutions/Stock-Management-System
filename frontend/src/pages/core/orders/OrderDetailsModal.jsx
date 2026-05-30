import { X, User, Package, MapPin, Calendar, DollarSign, FileText, Edit, Download, Truck } from '../../../components/icons';
import Button from '../../../components/common/Button';

const OrderDetailsModal = ({ order, isOpen, onClose, onEdit }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusColors = {
    'OrderSubmitted': 'from-blue-400 to-blue-600',
    'PaymentConfirmed': 'from-green-400 to-green-600',
    'UnderProcess': 'from-yellow-400 to-yellow-600',
    'Completed': 'from-emerald-400 to-emerald-600',
    'Cancelled': 'from-red-400 to-red-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${statusColors[order.status] || 'from-cyan-400 to-sky-500'} p-6 sm:p-8 text-white overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-ping" />
            <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2">Order Details</h2>
            <p className="text-white/90 text-sm sm:text-lg">Complete order information</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* Order ID Card */}
          <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 p-4 sm:p-6 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Order ID</p>
                <p className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400">#{order.id}</p>
              </div>
              <div className="sm:text-right w-full sm:w-auto">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${statusColors[order.status]} text-white shadow-lg`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer Information */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                  <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Customer</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{order.user?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Username</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">@{order.user?.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Customer ID</p>
                  <p className="text-base font-mono font-semibold text-cyan-600 dark:text-cyan-400">#{order.user?.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Role</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{order.user?.role || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                  <Package className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Product</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Product Name</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{order.productName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Quantity</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{order.quantity || 0}</p>
                </div>
                {order.product && (
                  <>
                    {order.product.color && (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Color</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{order.product.color}</p>
                      </div>
                    )}
                    {order.product.description && (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Description</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{order.product.description}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Delivery Address</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{order.deliveryAddress.street}</p>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{order.deliveryAddress.city}</p>
                  {order.deliveryAddress.state && (
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{order.deliveryAddress.state}</p>
                  )}
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{order.deliveryAddress.country || 'Ethiopia'}</p>
                  {order.deliveryAddress.zipCode && (
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">Zip: {order.deliveryAddress.zipCode}</p>
                  )}
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Timeline</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Created</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Last Updated</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Payment</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {order.totalPrice ? `${order.totalPrice} ETB` : 'Contact for price'}
                </p>
              </div>
              {order.payments && order.payments.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Payment Status</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{order.payments[0].status}</p>
                </div>
              )}
            </div>
          </div>

          {/* Custom Notes */}
          {order.customNotes && (
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Custom Notes</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{order.customNotes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              onClick={onEdit}
              className="flex-1"
              variant="primary"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Order
            </Button>
            <Button
              onClick={onClose}
              className="flex-1"
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;