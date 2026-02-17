import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Activity, 
  DollarSign 
} from '../../../components/icons';

/**
 * Dashboard Service
 * Handles data fetching and processing for the dashboard
 */

export const getDashboardData = async (timeRange = '7d') => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - in production, this would fetch from API
  const stats = [
    { 
      title: 'Total Products', 
      value: '2,847', 
      change: '+12.5%', 
      changeType: 'positive',
      icon: <Package className="w-6 h-6" />,
      trend: [65, 78, 82, 95, 88, 92, 105],
      color: 'cyan'
    },
    { 
      title: 'Active Orders', 
      value: '156', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: [45, 52, 48, 61, 55, 67, 72],
      color: 'green'
    },
    { 
      title: 'Low Stock Alerts', 
      value: '23', 
      change: '+3', 
      changeType: 'warning',
      icon: <AlertTriangle className="w-6 h-6" />,
      trend: [12, 15, 18, 22, 19, 21, 23],
      color: 'yellow'
    },
    { 
      title: 'Production Units', 
      value: '1,234', 
      change: '+15.8%', 
      changeType: 'positive',
      icon: <Activity className="w-6 h-6" />,
      trend: [890, 920, 980, 1050, 1120, 1180, 1234],
      color: 'blue'
    }
  ];

  const recentActivities = [
    { 
      id: 1, 
      action: 'Stock replenished', 
      item: 'Executive Office Desk', 
      time: '2 minutes ago', 
      type: 'stock',
      user: 'John Smith',
      quantity: '+50 units'
    },
    { 
      id: 2, 
      action: 'New order received', 
      item: 'Order #SMS-2024-0156', 
      time: '15 minutes ago', 
      type: 'order',
      user: 'Sarah Johnson',
      amount: '$2,450'
    },
    { 
      id: 3, 
      action: 'Production completed', 
      item: 'Dining Table Set - Batch #DT-567', 
      time: '1 hour ago', 
      type: 'production',
      user: 'Production Team',
      quantity: '25 units'
    },
    { 
      id: 4, 
      action: 'Critical stock alert', 
      item: 'Modern Sofa Collection', 
      time: '2 hours ago', 
      type: 'alert',
      user: 'System',
      quantity: '5 units remaining'
    },
    { 
      id: 5, 
      action: 'Quality check passed', 
      item: 'King Size Platform Bed', 
      time: '3 hours ago', 
      type: 'quality',
      user: 'QA Team',
      quantity: '100% pass rate'
    }
  ];

  const topProducts = [
    { 
      id: 1, 
      name: 'Executive Office Desk', 
      sales: 145, 
      revenue: '$129,550', 
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
      category: 'Office Furniture'
    },
    { 
      id: 2, 
      name: 'Modern Dining Table', 
      sales: 98, 
      revenue: '$63,702', 
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=60&h=60&fit=crop',
      category: 'Dining Room'
    },
    { 
      id: 3, 
      name: 'King Size Platform Bed', 
      sales: 67, 
      revenue: '$87,033', 
      trend: 'down',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&h=60&fit=crop',
      category: 'Bedroom'
    },
    { 
      id: 4, 
      name: 'Luxury Sofa Set', 
      sales: 45, 
      revenue: '$67,500', 
      trend: 'up',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
      category: 'Living Room'
    }
  ];

  const systemHealth = {
    overall: 98.5,
    database: 99.2,
    api: 97.8,
    storage: 98.9,
    network: 99.1
  };

  return {
    stats,
    recentActivities,
    topProducts,
    systemHealth
  };
};

export const addRevenueStatForSuperAdmin = (stats) => {
  return [
    ...stats,
    {
      title: 'Monthly Revenue', 
      value: '$127,450', 
      change: '+22.1%', 
      changeType: 'positive',
      icon: <DollarSign className="w-6 h-6" />,
      trend: [85000, 92000, 98000, 105000, 115000, 122000, 127450],
      color: 'purple'
    }
  ];
};
