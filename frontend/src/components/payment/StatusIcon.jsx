import { CheckCircle, XCircle, Clock, AlertTriangle } from '../icons';

const StatusIcon = ({ 
  status = 'success', 
  size = 'medium',
  className = "" 
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600'
    }
  };

  const config = statusConfig[status] || statusConfig.success;
  const IconComponent = config.icon;

  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${config.color} ${className}`}
      aria-label={`${status} status`}
    />
  );
};

export default StatusIcon;