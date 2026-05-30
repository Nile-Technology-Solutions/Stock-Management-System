/**
 * Super Admin Mock Data
 * Comprehensive mock data matching Swagger API specification
 * Used when VITE_USE_MOCK=true or as fallback when API fails
 */

import { mockUsers } from './mockData';

// Helper functions for generating realistic data
const generateId = () => Math.floor(Math.random() * 10000) + 1;
const generateDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};
const formatCurrency = (amount) => `$${amount.toLocaleString()}`;
const generatePercentage = (min = -10, max = 30) => {
  const value = (Math.random() * (max - min) + min).toFixed(1);
  return value > 0 ? `+${value}%` : `${value}%`;
};

// Dashboard Statistics for Super Admin
const generateDashboardStats = () => [
  {
    title: 'Total Products',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: 'Package',
    trend: [65, 78, 82, 95, 88, 92, 105],
    color: 'cyan',
    metadata: {
      totalValue: '$1,245,678',
      categories: 12,
      lowStock: 23
    }
  },
  {
    title: 'Active Orders',
    value: '156',
    change: '+8.2%',
    changeType: 'positive',
    icon: 'ShoppingCart',
    trend: [45, 52, 48, 61, 55, 67, 72],
    color: 'green',
    metadata: {
      pending: 45,
      processing: 78,
      shipped: 33,
      totalValue: '$89,234'
    }
  },
  {
    title: 'Low Stock Alerts',
    value: '23',
    change: '+3',
    changeType: 'warning',
    icon: 'AlertTriangle',
    trend: [12, 15, 18, 22, 19, 21, 23],
    color: 'yellow',
    metadata: {
      critical: 8,
      warning: 15,
      totalProductsAtRisk: 45
    }
  },
  {
    title: 'Production Units',
    value: '1,234',
    change: '+15.8%',
    changeType: 'positive',
    icon: 'Activity',
    trend: [890, 920, 980, 1050, 1120, 1180, 1234],
    color: 'blue',
    metadata: {
      thisMonth: 445,
      lastMonth: 389,
      efficiency: '94.2%',
      target: 1300
    }
  },
  {
    title: 'Monthly Revenue',
    value: '$127,450',
    change: '+22.1%',
    changeType: 'positive',
    icon: 'DollarSign',
    trend: [85000, 92000, 98000, 105000, 115000, 122000, 127450],
    color: 'purple',
    metadata: {
      dailyAverage: '$4,248',
      target: '$120,000',
      achievement: '106.2%',
      profit: '$38,235'
    }
  },
  {
    title: 'Total Users',
    value: '1,847',
    change: '+5.3%',
    changeType: 'positive',
    icon: 'Users',
    trend: [1650, 1720, 1750, 1780, 1810, 1820, 1847],
    color: 'indigo',
    metadata: {
      active: 1247,
      inactive: 600,
      newThisMonth: 47,
      premium: 234
    }
  }
];

// Recent Activities
const generateRecentActivities = () => [
  {
    id: generateId(),
    action: 'Stock replenished',
    item: 'Executive Office Desk',
    time: '2 minutes ago',
    type: 'stock',
    user: 'John Smith',
    quantity: '+50 units',
    metadata: {
      previousStock: 15,
      newStock: 65,
      location: 'Warehouse A'
    }
  },
  {
    id: generateId(),
    action: 'New order received',
    item: 'Order #AH-2024-0156',
    time: '15 minutes ago',
    type: 'order',
    user: 'Sarah Johnson',
    amount: '$2,450',
    metadata: {
      customerId: 892,
      items: 3,
      paymentMethod: 'Credit Card'
    }
  },
  {
    id: generateId(),
    action: 'Production completed',
    item: 'Dining Table Set - Batch #DT-567',
    time: '1 hour ago',
    type: 'production',
    user: 'Production Team',
    quantity: '25 units',
    metadata: {
      batchId: 'DT-567',
      qualityScore: '98.5%',
      completionTime: '2.5 hours'
    }
  },
  {
    id: generateId(),
    action: 'Critical stock alert',
    item: 'Modern Sofa Collection',
    time: '2 hours ago',
    type: 'alert',
    user: 'System',
    quantity: '5 units remaining',
    metadata: {
      reorderPoint: 20,
      daysUntilStockout: 2,
      supplier: 'Premium Furniture Co.'
    }
  },
  {
    id: generateId(),
    action: 'User account created',
    item: 'New Admin User',
    time: '3 hours ago',
    type: 'user',
    user: 'System Admin',
    metadata: {
      userId: generateId(),
      role: 'Admin',
      createdBy: 'Super Admin'
    }
  },
  {
    id: generateId(),
    action: 'Payment received',
    item: 'Invoice #INV-2024-0892',
    time: '4 hours ago',
    type: 'payment',
    user: 'Billing System',
    amount: '$5,678',
    metadata: {
      customerId: 456,
      paymentMethod: 'Bank Transfer',
      dueDate: generateDate(-7)
    }
  }
];

// Top Products
const generateTopProducts = () => [
  {
    id: generateId(),
    name: 'Executive Office Desk',
    sales: 145,
    revenue: '$129,550',
    trend: 'up',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
    category: 'Office Furniture',
    metadata: {
      rating: 4.8,
      reviews: 234,
      stockLevel: 78,
      price: '$893'
    }
  },
  {
    id: generateId(),
    name: 'Modern Dining Table',
    sales: 98,
    revenue: '$63,702',
    trend: 'up',
    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=60&h=60&fit=crop',
    category: 'Dining Room',
    metadata: {
      rating: 4.6,
      reviews: 156,
      stockLevel: 45,
      price: '$650'
    }
  },
  {
    id: generateId(),
    name: 'King Size Platform Bed',
    sales: 67,
    revenue: '$87,033',
    trend: 'down',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&h=60&fit=crop',
    category: 'Bedroom',
    metadata: {
      rating: 4.9,
      reviews: 189,
      stockLevel: 23,
      price: '$1,299'
    }
  },
  {
    id: generateId(),
    name: 'Luxury Sofa Set',
    sales: 45,
    revenue: '$67,500',
    trend: 'up',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop',
    category: 'Living Room',
    metadata: {
      rating: 4.7,
      reviews: 98,
      stockLevel: 15,
      price: '$1,500'
    }
  }
];

// System Health
const generateSystemHealth = () => ({
  overall: 98.5,
  database: 99.2,
  api: 97.8,
  storage: 98.9,
  network: 99.1,
  services: {
    authentication: 99.5,
    paymentGateway: 98.2,
    emailService: 97.6,
    backupService: 99.8
  },
  lastUpdated: new Date().toISOString()
});

// User Management Data
const generateUsers = (page = 1, limit = 10) => {
  const allUsers = [
    ...mockUsers.map(user => ({
      ...user,
      id: user.id,
      email: `${user.username.toLowerCase()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: {
        street: `${Math.floor(Math.random() * 9999)} Main St`,
        city: 'Addis Ababa',
        state: 'Addis Ababa',
        zipCode: `${Math.floor(Math.random() * 9000) + 1000}`,
        country: 'Ethiopia'
      },
      lastLogin: generateDate(Math.floor(Math.random() * 30)),
      createdAt: generateDate(Math.floor(Math.random() * 365)),
      isActive: Math.random() > 0.2,
      permissions: user.role === 'Super Admin' ? ['all'] : ['dashboard', 'orders', 'stock']
    })),
    // Additional mock users
    ...Array.from({ length: 20 }, (_, i) => ({
      id: generateId(),
      username: `user${i + 100}`,
      fullName: `User ${i + 100}`,
      email: `user${i + 100}@example.com`,
      role: Math.random() > 0.7 ? 'Admin' : 'Customer',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: {
        street: `${Math.floor(Math.random() * 9999)} Business Ave`,
        city: 'Addis Ababa',
        state: 'Addis Ababa',
        zipCode: `${Math.floor(Math.random() * 9000) + 1000}`,
        country: 'Ethiopia'
      },
      lastLogin: generateDate(Math.floor(Math.random() * 30)),
      createdAt: generateDate(Math.floor(Math.random() * 365)),
      isActive: Math.random() > 0.2,
      permissions: ['dashboard', 'orders']
    }))
  ];

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = allUsers.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(allUsers.length / limit),
      totalUsers: allUsers.length,
      limit,
      hasNext: endIndex < allUsers.length,
      hasPrev: page > 1
    }
  };
};

// Reports Data
const generateStockReport = (timeRange = '7d') => ({
  timeRange,
  summary: {
    totalProducts: 2847,
    totalValue: '$1,245,678',
    lowStockItems: 23,
    outOfStockItems: 5,
    warehouseUtilization: '78.5%'
  },
  categories: [
    { name: 'Office Furniture', products: 892, value: '$456,789', trend: '+12.3%' },
    { name: 'Bedroom', products: 654, value: '$345,678', trend: '+8.7%' },
    { name: 'Living Room', products: 543, value: '$234,567', trend: '+5.2%' },
    { name: 'Dining Room', products: 432, value: '$123,456', trend: '+3.4%' },
    { name: 'Outdoor', products: 326, value: '$85,188', trend: '+15.6%' }
  ],
  lowStockAlerts: Array.from({ length: 23 }, (_, i) => ({
    id: generateId(),
    productName: `Product ${i + 1}`,
    currentStock: Math.floor(Math.random() * 20),
    reorderPoint: Math.floor(Math.random() * 50) + 20,
    supplier: `Supplier ${Math.floor(Math.random() * 5) + 1}`,
    daysUntilStockout: Math.floor(Math.random() * 7) + 1,
    lastSale: generateDate(Math.floor(Math.random() * 14))
  })),
  movements: Array.from({ length: 50 }, (_, i) => ({
    id: generateId(),
    date: generateDate(Math.floor(Math.random() * 30)),
    type: Math.random() > 0.5 ? 'in' : 'out',
    productName: `Product ${Math.floor(Math.random() * 100) + 1}`,
    quantity: Math.floor(Math.random() * 100) + 1,
    reference: Math.random() > 0.5 ? `PO-${generateId()}` : `SO-${generateId()}`,
    user: mockUsers[Math.floor(Math.random() * mockUsers.length)].fullName
  }))
});

const generateProductionReport = (timeRange = '7d') => ({
  timeRange,
  summary: {
    totalUnits: 1234,
    targetUnits: 1300,
    efficiency: '94.2%',
    avgProductionTime: '2.5 hours',
    qualityRate: '98.5%'
  },
  byProduct: [
    { name: 'Executive Office Desk', produced: 145, target: 150, efficiency: '96.7%' },
    { name: 'Modern Dining Table', produced: 98, target: 100, efficiency: '98.0%' },
    { name: 'King Size Platform Bed', produced: 67, target: 70, efficiency: '95.7%' },
    { name: 'Luxury Sofa Set', produced: 45, target: 50, efficiency: '90.0%' }
  ],
  dailyProduction: Array.from({ length: 7 }, (_, i) => ({
    date: generateDate(i),
    units: Math.floor(Math.random() * 50) + 150,
    target: 180,
    efficiency: `${(Math.random() * 20 + 80).toFixed(1)}%`
  })),
  qualityMetrics: {
    passed: 1210,
    failed: 24,
    rework: 15,
    qualityRate: '96.8%',
    commonIssues: ['Finish defects', 'Dimensional errors', 'Assembly issues']
  }
});

const generateOrderReport = (timeRange = '7d') => ({
  timeRange,
  summary: {
    totalOrders: 156,
    totalValue: '$89,234',
    avgOrderValue: '$572',
    completionRate: '94.2%'
  },
  byStatus: [
    { status: 'Pending', count: 45, value: '$25,678', percentage: '28.8%' },
    { status: 'Processing', count: 78, value: '$44,567', percentage: '50.0%' },
    { status: 'Shipped', count: 33, value: '$18,989', percentage: '21.2%' }
  ],
  byRegion: [
    { region: 'Addis Ababa', orders: 89, value: '$51,234', avgValue: '$576' },
    { region: 'Dire Dawa', orders: 34, value: '$19,456', avgValue: '$572' },
    { region: 'Mekelle', orders: 23, value: '$13,567', avgValue: '$589' },
    { region: 'Bahir Dar', orders: 10, value: '$4,977', avgValue: '$498' }
  ],
  topCustomers: Array.from({ length: 10 }, (_, i) => ({
    customerId: generateId(),
    customerName: `Customer ${i + 1}`,
    orders: Math.floor(Math.random() * 10) + 1,
    totalValue: formatCurrency(Math.floor(Math.random() * 10000) + 1000),
    avgOrderValue: formatCurrency(Math.floor(Math.random() * 2000) + 500)
  }))
});

const generatePaymentReport = (timeRange = '7d') => ({
  timeRange,
  summary: {
    totalPayments: 234,
    totalAmount: '$127,450',
    avgPayment: '$544',
    successRate: '96.8%'
  },
  byMethod: [
    { method: 'Credit Card', count: 145, amount: '$78,234', percentage: '61.4%' },
    { method: 'Bank Transfer', count: 56, amount: '$34,567', percentage: '23.9%' },
    { method: 'Mobile Payment', count: 23, amount: '$12,456', percentage: '9.8%' },
    { method: 'Cash', count: 10, amount: '$2,193', percentage: '4.3%' }
  ],
  byStatus: [
    { status: 'Completed', count: 227, amount: '$123,456', percentage: '96.8%' },
    { status: 'Pending', count: 5, amount: '$2,567', percentage: '2.1%' },
    { status: 'Failed', count: 2, amount: '$1,427', percentage: '1.1%' }
  ],
  dailyPayments: Array.from({ length: 7 }, (_, i) => ({
    date: generateDate(i),
    payments: Math.floor(Math.random() * 40) + 20,
    amount: formatCurrency(Math.floor(Math.random() * 20000) + 15000),
    successRate: `${(Math.random() * 5 + 95).toFixed(1)}%`
  }))
});

const generateSalesReport = (timeRange = '7d') => ({
  timeRange,
  summary: {
    totalRevenue: '$127,450',
    targetRevenue: '$120,000',
    achievement: '106.2%',
    profit: '$38,235',
    profitMargin: '30.0%'
  },
  byProduct: [
    { 
      productName: 'Executive Office Desk', 
      revenue: '$45,678', 
      units: 145, 
      profit: '$13,703',
      margin: '30.0%',
      growth: '+12.5%'
    },
    { 
      productName: 'Modern Dining Table', 
      revenue: '$28,901', 
      units: 98, 
      profit: '$8,670',
      margin: '30.0%',
      growth: '+8.3%'
    },
    { 
      productName: 'King Size Platform Bed', 
      revenue: '$31,467', 
      units: 67, 
      profit: '$9,440',
      margin: '30.0%',
      growth: '+15.2%'
    },
    { 
      productName: 'Luxury Sofa Set', 
      revenue: '$21,404', 
      units: 45, 
      profit: '$6,422',
      margin: '30.0%',
      growth: '+6.7%'
    }
  ],
  byRegion: [
    { region: 'Addis Ababa', revenue: '$71,234', percentage: '55.9%', growth: '+12.3%' },
    { region: 'Dire Dawa', revenue: '$28,901', percentage: '22.7%', growth: '+8.9%' },
    { region: 'Mekelle', revenue: '$18,456', percentage: '14.5%', growth: '+15.6%' },
    { region: 'Bahir Dar', revenue: '$8,859', percentage: '6.9%', growth: '+5.2%' }
  ],
  dailySales: Array.from({ length: 7 }, (_, i) => ({
    date: generateDate(i),
    revenue: formatCurrency(Math.floor(Math.random() * 20000) + 15000),
    units: Math.floor(Math.random() * 30) + 20,
    avgOrderValue: formatCurrency(Math.floor(Math.random() * 800) + 400)
  }))
});

// Financial Data
const generateFinancialSummary = (timeRange = '7d') => ({
  timeRange,
  revenue: {
    total: '$127,450',
    target: '$120,000',
    achievement: '106.2%',
    growth: '+22.1%',
    dailyAverage: '$4,248',
    monthlyTrend: [85000, 92000, 98000, 105000, 115000, 122000, 127450]
  },
  costs: {
    total: '$89,215',
    materials: '$45,234',
    labor: '$25,678',
    overhead: '$18,303',
    costMargin: '70.0%'
  },
  profit: {
    total: '$38,235',
    margin: '30.0%',
    growth: '+18.5%',
    netMargin: '25.2%'
  },
  cashFlow: {
    inflow: '$134,567',
    outflow: '$96,332',
    net: '$38,235',
    balance: '$245,678'
  },
  systemHealth: {
    overall: 98.5,
    database: 99.2,
    api: 97.8,
    storage: 98.9,
    network: 99.1
  }
});

// System Settings
const generateSystemSettings = () => ({
  general: {
    companyName: 'AddHomes Creative Woodworks',
    companyEmail: 'info@addhomescreative.com',
    companyPhone: '+251 905 488 848',
    companyAddress: 'Shegole Mender-7, Addis Ababa, Ethiopia',
    timezone: 'Africa/Addis_Ababa',
    currency: 'ETB',
    dateFormat: 'DD/MM/YYYY'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    orderNotifications: true,
    paymentAlerts: true,
    systemAlerts: true
  },
  security: {
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    ipWhitelist: [],
    auditLog: true
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    backupLocation: 'cloud',
    lastBackup: generateDate(1),
    nextBackup: generateDate(-1)
  },
  api: {
    rateLimit: 1000,
    corsEnabled: true,
    apiVersion: 'v1.4.0',
    swaggerEnabled: true,
    mockDataEnabled: true
  }
});

// Main export object
export const superAdminMockData = {
  // Dashboard
  getDashboardData: (params = {}) => {
    const { timeRange = '7d' } = params;
    return {
      stats: generateDashboardStats(),
      recentActivities: generateRecentActivities(),
      topProducts: generateTopProducts(),
      systemHealth: generateSystemHealth(),
      financialSummary: generateFinancialSummary(timeRange),
      timeRange,
      lastUpdated: new Date().toISOString()
    };
  },

  // User Management
  getUsers: (params = {}) => {
    const { page = 1, limit = 10, search = '', role = '' } = params;
    const userData = generateUsers(page, limit);
    
    if (search || role) {
      userData.users = userData.users.filter(user => 
        (!search || user.fullName.toLowerCase().includes(search.toLowerCase()) || 
         user.email.toLowerCase().includes(search.toLowerCase())) &&
        (!role || user.role === role)
      );
    }
    
    return userData;
  },

  getUserById: (userId) => {
    const allUsers = generateUsers(1, 1000).users;
    const user = allUsers.find(u => u.id == userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  createUser: (userData) => {
    const newUser = {
      id: generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: null
    };
    return newUser;
  },

  updateUser: (userId, userData) => {
    const existingUser = superAdminMockData.getUserById(userId);
    return {
      ...existingUser,
      ...userData,
      updatedAt: new Date().toISOString()
    };
  },

  deleteUser: (userId) => {
    superAdminMockData.getUserById(userId); // Will throw if not found
    return { 
      message: 'User deleted successfully',
      userId,
      deletedAt: new Date().toISOString()
    };
  },

  // Reports
  reports: {
    stock: (params = {}) => generateStockReport(params.timeRange),
    production: (params = {}) => generateProductionReport(params.timeRange),
    orders: (params = {}) => generateOrderReport(params.timeRange),
    payments: (params = {}) => generatePaymentReport(params.timeRange),
    sales: (params = {}) => generateSalesReport(params.timeRange)
  },

  // Financial
  financial: {
    getRevenue: (params = {}) => ({
      ...generateFinancialSummary(params.timeRange).revenue,
      details: Array.from({ length: 30 }, (_, i) => ({
        date: generateDate(i),
        revenue: formatCurrency(Math.floor(Math.random() * 5000) + 3000),
        orders: Math.floor(Math.random() * 20) + 10,
        avgOrderValue: formatCurrency(Math.floor(Math.random() * 500) + 300)
      }))
    }),
    getSummary: (params = {}) => generateFinancialSummary(params.timeRange)
  },

  // Settings
  settings: {
    getSettings: () => generateSystemSettings(),
    updateSettings: (settingsData) => {
      const currentSettings = generateSystemSettings();
      return {
        ...currentSettings,
        ...settingsData,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Super Admin'
      };
    }
  }
};

export default superAdminMockData;
