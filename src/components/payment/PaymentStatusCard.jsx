import { CheckCircle, XCircle, Clock } from '../icons';

const PaymentStatusCard = ({ 
  status = 'success', 
  orderId, 
  message, 
  description,
  actions,
  className = "" 
}) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'Payment Successful',
      defaultMessage: 'Your payment has been processed successfully.'
    },
    failed: {
      icon: XCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
      title: 'Payment Failed',
      defaultMessage: 'We were unable to process your payment.'
    },
    pending: {
      icon: Clock,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      title: 'Payment Pending',
      defaultMessage: 'Your payment is being verified.'
    }
  };

  const config = statusConfig[status] || statusConfig.success;
  const IconComponent = config.icon;

  return (
    <div className={`bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-8 text-center ${className}`}>
      {/* Status Icon */}
      <div className={`mx-auto w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mb-6`}>
        <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
      </div>

      {/* Status Title */}
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">
        {config.title}
      </h2>

      {/* Order ID */}
      {orderId && (
        <div className="mb-4">
          <p className="text-sm text-slate-600">Order ID</p>
          <p className="text-lg font-mono font-medium text-slate-900">{orderId}</p>
        </div>
      )}

      {/* Status Message */}
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        {message || config.defaultMessage}
      </p>

      {/* Additional Description */}
      {description && (
        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-slate-700">{description}</p>
        </div>
      )}

      {/* Action Buttons */}
      {actions && (
        <div className="space-y-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PaymentStatusCard;