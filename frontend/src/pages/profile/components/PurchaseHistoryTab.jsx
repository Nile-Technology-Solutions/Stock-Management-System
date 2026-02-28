import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../../../services/profileApi';
import Loader from '../../../components/common/Loader';

const PurchaseHistoryTab = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPurchaseHistory();
  }, []);

  const loadPurchaseHistory = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getPurchaseHistory();
      
      // Handle different response structures
      const ordersData = response.data?.orders || response.orders || [];
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load purchase history:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      OrderSubmitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PaymentConfirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      UnderProcess: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-12">
        <Loader size="large" text="Loading purchase history..." />
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Purchase History</h2>
        
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'OrderSubmitted', 'PaymentConfirmed', 'UnderProcess', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                filter === status
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {status === 'all' ? 'All' : status.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {filter === 'all' ? "You haven't placed any orders yet" : `No ${filter} orders`}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {order.productName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Order ID:</span>
                      <p className="font-medium text-slate-900 dark:text-white">#{order.id}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                      <p className="font-medium text-slate-900 dark:text-white">{order.quantity}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Total Price:</span>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {order.totalPrice ? `ETB ${parseFloat(order.totalPrice).toFixed(2)}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Date:</span>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {order.customNotes && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Notes:</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{order.customNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/order-tracking?orderId=${order.id}`)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryTab;
