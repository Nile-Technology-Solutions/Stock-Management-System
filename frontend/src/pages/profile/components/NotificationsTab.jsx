import { useState, useEffect } from 'react';
import { profileApi } from '../../../services/profileApi';
import Loader from '../../../components/common/Loader';

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getNotifications();
      
      // Handle different response structures
      const notificationsData = response.data?.notifications || response.notifications || [];
      setNotifications(notificationsData.length > 0 ? notificationsData : mockNotifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      // Fallback to mock data
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await profileApi.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(unreadIds.map(id => profileApi.markNotificationRead(id)));
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: '📦',
      payment: '💳',
      delivery: '🚚',
      promotion: '🎉',
      system: '⚙️',
      info: 'ℹ️'
    };
    return icons[type] || '🔔';
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-12">
        <Loader size="large" text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
        
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'unread', 'order', 'payment', 'delivery', 'promotion'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
              filter === filterType
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No notifications
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            You're all caught up!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                notification.read
                  ? 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'
                  : 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock notifications for fallback
const mockNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #1234 has been confirmed and is being processed.',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of ETB 5,000 has been processed successfully.',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    type: 'delivery',
    title: 'Order Shipped',
    message: 'Your order is on its way! Expected delivery in 2-3 days.',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 4,
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on your next order! Use code: SAVE20',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export default NotificationsTab;
