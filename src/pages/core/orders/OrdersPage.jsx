import { useState, useEffect, useCallback } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import { ShoppingCart, Package, RefreshCw, Plus, Search, Filter, CheckCircle2, XCircle, Clock, MoreVertical, Edit3 } from '../../../components/icons';
import { orderApi } from '../../../services/orderApi';

/**
 * OrdersPage - Aligned with Swagger v1.4.0
 * Status Enums: Ordered, Processing, Shipping, Delivering, Delivered, Canceled
 */

const ORDER_STATUSES = ['Ordered', 'Processing', 'Shipping', 'Delivering', 'Delivered', 'Canceled'];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const data = await orderApi.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenEdit = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await orderApi.updateOrder(selectedOrder.id, { ...selectedOrder, status: newStatus });
      setOrders(prev => prev.map(o =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.customer || order.userName || 'Unknown';
    const orderId = String(order.id);
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (id) => <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{typeof id === 'object' ? JSON.stringify(id) : id}</span>
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (name, order) => {
        const displayName = typeof name === 'object' ? (name?.name || name?.fullName || JSON.stringify(name)) : (name || order?.userName || 'N/A');
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{displayName}</span>
          </div>
        );
      }
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (items) => {
        const displayItems = typeof items === 'object' ? (Array.isArray(items) ? `${items.length} items` : JSON.stringify(items)) : (items || 'Details in View');
        return <span className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate block">{displayItems}</span>;
      }
    },
    {
      header: 'Amount',
      accessor: 'total',
      render: (val) => {
        const displayVal = typeof val === 'object' ? (val?.amount || val?.total || JSON.stringify(val)) : val;
        return <span className="font-bold text-cyan-600 dark:text-cyan-400">{displayVal} {typeof displayVal === 'number' ? 'ETB' : ''}</span>;
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => {
        const styles = {
          'Ordered': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
          'Processing': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200',
          'Shipping': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
          'Delivering': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200',
          'Delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
          'Canceled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200'
        };
        const dotColors = {
          'Ordered': 'bg-blue-500',
          'Processing': 'bg-indigo-500',
          'Shipping': 'bg-purple-500',
          'Delivering': 'bg-cyan-500',
          'Delivered': 'bg-green-500',
          'Canceled': 'bg-red-500'
        };
        const style = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
        const dotColor = dotColors[status] || 'bg-slate-500';

        return (
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-2 w-fit ${style}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {status}
          </span>
        );
      }
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (date) => {
        if (!date) return 'N/A';
        const dateValue = typeof date === 'object' ? (date?.value || date?.date || date) : date;
        try {
          return new Date(dateValue).toLocaleDateString();
        } catch (e) {
          return String(dateValue);
        }
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, order) => (
        <button
          onClick={() => handleOpenEdit(order)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
        >
          <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-cyan-500" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="standard" className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/30">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Order Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Manage sales pipeline and fulfillment
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => fetchOrders(true)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-green-500/25">
              <Plus className="w-5 h-5" />
              Direct Entry
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
            placeholder="Search by Order ID or Customer name..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 appearance-none shadow-sm font-medium text-slate-700 dark:text-slate-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <GlassCard className="p-4 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest">Loading Orders...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredOrders}
            pagination={true}
            pageSize={6}
          />
        )}
      </GlassCard>

      {/* Status Update Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !updating && setIsEditModalOpen(false)}
        title={`Update Order: ${selectedOrder?.id}`}
      >
        <div className="space-y-6 pt-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Customer:</span>
              <span className="text-sm font-bold">{selectedOrder?.customer || selectedOrder?.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Total Amount:</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{selectedOrder?.total} {typeof selectedOrder?.total === 'number' ? 'ETB' : ''}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest px-1">Set New Status</label>
            <div className="grid grid-cols-2 gap-3">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  onClick={() => handleStatusUpdate(status)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedOrder?.status === status
                    ? `border-green-400 bg-green-50 dark:bg-green-900/10 text-green-600 shadow-md`
                    : 'border-transparent bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs'
                    }`}
                >
                  <span className="font-bold">{status}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {updating && (
              <div className="flex items-center justify-center gap-2 text-cyan-500 py-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-bold uppercase tracking-widest">Updating System...</span>
              </div>
            )}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersPage;
