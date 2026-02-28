import { CreditCard } from '../icons';

const PaymentSummaryCard = ({ 
  orderData, 
  className = "" 
}) => {
  if (!orderData) return null;

  const { orderId, product, quantity = 1, totalAmount, customerInfo } = orderData;

  return (
    <div className={`bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="p-3 bg-cyan-100 rounded-lg mr-4">
          <CreditCard className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Payment Summary</h3>
          <p className="text-sm text-slate-600">Order #{orderId}</p>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 mb-1">{product?.name}</h4>
            {product?.category && (
              <span className="inline-block px-2 py-1 text-xs font-medium text-cyan-700 bg-cyan-50 rounded-md">
                {product.category}
              </span>
            )}
          </div>
          <div className="text-right ml-4">
            <p className="text-sm text-slate-600">Qty: {quantity}</p>
            <p className="font-semibold text-slate-900">{product?.price}</p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      {customerInfo && (
        <div className="border-t border-white/20 pt-4 mb-6">
          <h5 className="text-sm font-medium text-slate-700 mb-2">Delivery Information</h5>
          <div className="text-sm text-slate-600 space-y-1">
            <p>{customerInfo.fullName}</p>
            <p>{customerInfo.phoneNumber}</p>
            {customerInfo.email && <p>{customerInfo.email}</p>}
          </div>
        </div>
      )}

      {/* Total Amount */}
      <div className="border-t border-white/20 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-slate-900">Total Amount</span>
          <span className="text-2xl font-semibold text-slate-900">
            {totalAmount || product?.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;