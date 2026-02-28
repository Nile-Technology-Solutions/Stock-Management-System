import { FileText, CheckCircle, Settings, Check, Clock } from '../../components/icons';

const OrderStatusTimeline = ({ 
  currentStatus = 'submitted', 
  className = "",
  orderDate,
  estimatedDelivery 
}) => {
  const statuses = [
    {
      key: 'submitted',
      label: 'Order Submitted',
      description: 'Your order has been received',
      icon: <FileText className="w-5 h-5" />
    },
    {
      key: 'confirmed',
      label: 'Order Confirmed',
      description: 'Order details verified and confirmed',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      key: 'under_process',
      label: 'Under Process',
      description: 'Your order is being prepared',
      icon: <Settings className="w-5 h-5" />
    },
    {
      key: 'completed',
      label: 'Completed',
      description: 'Order delivered successfully',
      icon: <Check className="w-5 h-5" />
    }
  ];

  const getStatusIndex = (status) => {
    return statuses.findIndex(s => s.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  const getStatusColor = (index) => {
    if (index < currentIndex) {
      return 'text-green-600 bg-green-100 border-green-200'; // Completed
    } else if (index === currentIndex) {
      if (currentStatus === 'completed') {
        return 'text-green-600 bg-green-100 border-green-200'; // Completed
      } else if (currentStatus === 'under_process') {
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'; // In Progress
      } else {
        return 'text-cyan-600 bg-cyan-100 border-cyan-200'; // Current
      }
    } else {
      return 'text-slate-400 bg-slate-100 border-slate-200'; // Pending
    }
  };

  const getConnectorColor = (index) => {
    if (index < currentIndex) {
      return 'bg-green-200';
    } else if (index === currentIndex && currentStatus !== 'submitted') {
      return 'bg-cyan-200';
    } else {
      return 'bg-slate-200';
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Order Status</h3>
        {orderDate && (
          <span className="text-sm text-slate-500">
            Ordered: {new Date(orderDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="relative">
        {statuses.map((status, index) => (
          <div key={status.key} className="relative flex items-start pb-8 last:pb-0">
            {/* Connector Line */}
            {index < statuses.length - 1 && (
              <div 
                className={`absolute left-6 top-12 w-0.5 h-8 ${getConnectorColor(index)} transition-colors duration-300`}
              />
            )}
            
            {/* Status Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStatusColor(index)}`}>
              {status.icon}
            </div>
            
            {/* Status Content */}
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${
                  index <= currentIndex ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {status.label}
                </h4>
                {index === currentIndex && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-cyan-700 bg-cyan-50 rounded-md">
                    Current
                  </span>
                )}
              </div>
              <p className={`text-sm mt-1 ${
                index <= currentIndex ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {status.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Estimated Delivery */}
      {estimatedDelivery && currentStatus !== 'completed' && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center text-sm text-slate-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              Estimated delivery: <span className="font-medium text-slate-900">{estimatedDelivery}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusTimeline;