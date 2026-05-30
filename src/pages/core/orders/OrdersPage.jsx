import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { ShoppingCart, RefreshCw, Plus, Search, Filter, Eye } from '../../../components/icons';
import { orderApi } from '../../../services/orderApi';
import OrderDetailsModal from './OrderDetailsModal';
import OrderEditModal from './OrderEditModal';
import Loader from '../../../components/common/Loader';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const response = await orderApi.getOrders();
      console.log('Orders response:', response);

      // Handle nested response structure: { success: true, data: { orders: [...] } }
      const ordersData = response?.data?.orders || response?.orders || response;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetails = async (order) => {
    try {
      // Fetch full order details
      const fullOrder = await orderApi.getOrderById(order.id);
      setSelectedOrder(fullOrder);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      alert('Failed to load order details');
    }
  };

  const handleEditOrder = async (order) => {
    try {
      const fullOrder = await orderApi.getOrderById(order.id);
      setSelectedOrder(fullOrder);
      setShowEditModal(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      alert('Failed to load order details');
    }
  };

  const handleOrderUpdate = (updatedOrder) => {
    // Update the orders list with the new data
    setOrders(prev => prev.map(o =>
      o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
    ));

    // Close the edit modal
    setShowEditModal(false);

    // Optionally refresh to get the latest data from server
    setTimeout(() => {
      fetchOrders(true);
    }, 500);
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.user?.fullName || order.user?.username || 'Unknown';
    const orderId = String(order.id);
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    'OrderSubmitted': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
    'PaymentConfirmed': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
    'UnderProcess': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
    'Completed': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
    'ReadyForDelivery': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
    'Delivered': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400', dot: 'bg-teal-500' },
    'Cancelled': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' }
  };

  const handleMarkDelivered = async (order) => {
    if (!confirm(`Mark order #${order.id} as Delivered?`)) return;
    try {
      await orderApi.updateOrderStatus(order.id, 'Delivered');
      fetchOrders(true);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="standard" className="border-none shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-2xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Order Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Manage sales pipeline and fulfillment
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={() => fetchOrders(true)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, or Product..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="OrderSubmitted">Order Submitted</option>
            <option value="PaymentConfirmed">Payment Confirmed</option>
            <option value="UnderProcess">Under Process</option>
            <option value="Completed">Completed</option>
            <option value="ReadyForDelivery">Ready for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="large" text="Loading orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredOrders.map((order) => {
                  const style = statusStyles[order.status] || statusStyles['OrderSubmitted'];
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {order.user?.fullName || 'N/A'}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            ID: {order.user?.id || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {order.productName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Qty: {order.quantity}
                            </span>
                            {order.isCustom && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded font-semibold">
                                Custom
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">
                          {order.totalPrice ? `${order.totalPrice} ETB` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors group"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-cyan-500" />
                          </button>

                          {/* Create Production for custom orders with confirmed payment */}
                          {order.isCustom && order.status === 'PaymentConfirmed' && !order.productionRecord && (
                            <button
                              onClick={() => navigate(`/admin/production?orderId=${order.id}`)}
                              className="px-2 py-1 text-xs font-semibold bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors"
                              title="Create Production"
                            >
                              + Production
                            </button>
                          )}

                          {/* Mark Delivered */}
                          {order.status === 'ReadyForDelivery' && (
                            <button
                              onClick={() => handleMarkDelivered(order)}
                              className="px-2 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                              title="Mark as Delivered"
                            >
                              ✓ Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Modals */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {showEditModal && selectedOrder && (
        <OrderEditModal
          order={selectedOrder}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
};

export default OrdersPage;
