import { useState, useEffect } from 'react';
import { mockStock } from '../../../services/mockData';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import { Database, Package, RefreshCw, Plus, Search, Filter, Edit3, Trash2, AlertTriangle, Layers } from '../../../components/icons';
import { useAuth } from '../../../context/AuthContext';

const StockPage = () => {
  const { hasRole } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: 'Boards',
    origin: 'Local',
    thickness: '',
    price: '',
    color: ''
  });

  useEffect(() => {
    setStockItems(mockStock);
  }, []);

  const handleOpenAddModal = () => {
    setCurrentItem(null);
    setFormData({
      name: '',
      quantity: '',
      category: 'Boards',
      origin: 'Local',
      thickness: '',
      price: '',
      color: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      category: item.category,
      origin: item.origin,
      thickness: item.thickness || '',
      price: item.price.replace(/[^\d.]/g, '') || '',
      color: item.color || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.quantity || !formData.price) return false;
    if (isNaN(formData.quantity)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setFormLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const formattedItem = {
      ...formData,
      quantity: parseInt(formData.quantity),
      price: `${parseInt(formData.price).toLocaleString()} ETB`,
      lastUpdated: new Date().toISOString()
    };

    if (currentItem) {
      setStockItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, ...formattedItem } : item));
    } else {
      const newItem = {
        id: Math.max(...stockItems.map(i => i.id), 0) + 1,
        ...formattedItem
      };
      setStockItems(prev => [...prev, newItem]);
    }

    setFormLoading(false);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    setFormLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setStockItems(prev => prev.filter(item => item.id !== currentItem.id));
    setFormLoading(false);
    setIsDeleteModalOpen(false);
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      header: 'Material Name',
      accessor: 'name',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-xs text-slate-500">{item.category} • {item.origin}</div>
          </div>
        </div>
      )
    },
    {
      header: 'In Stock',
      accessor: 'quantity',
      render: (qty) => (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${qty < 20 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
            {qty}
          </span>
          {qty < 20 && (
            <div className="group relative">
              <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Low Stock Warning!
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (price) => <span className="font-medium text-slate-600 dark:text-slate-400">{price}</span>
    },
    {
      header: 'Last Updated',
      accessor: 'lastUpdated',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEditModal(item)}
            className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleOpenDeleteModal(item)}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="standard" className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/30">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Stock Management
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time raw materials and inventory control
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" onClick={handleOpenAddModal} className="flex items-center gap-2 shadow-lg shadow-cyan-500/25">
              <Plus className="w-5 h-5" />
              Add Material
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Analytics Summary Mini-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stockItems.length}</div>
            <div className="text-xs text-slate-500">Total Items</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stockItems.filter(i => i.quantity < 20).length}</div>
            <div className="text-xs text-slate-500">Low Stock</div>
          </div>
        </GlassCard>
      </div>

      {/* Main Stock Table */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by material name or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
             <Filter className="w-5 h-5 text-slate-400" />
             <select
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Boards">Boards</option>
              <option value="Lumber">Lumber</option>
              <option value="Hardware">Hardware</option>
              <option value="Finishes">Finishes</option>
            </select>
          </div>
        </div>

        <Table 
          columns={columns} 
          data={filteredItems} 
          pagination={true}
          pageSize={6}
        />
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentItem ? 'Update Stock Item' : 'Add New Material'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Material Name</label>
            <input
              required
              name="name"
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
              <input
                required
                name="quantity"
                type="number"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price (ETB)</label>
              <input
                required
                name="price"
                type="number"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select
                name="category"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Boards">Boards</option>
                <option value="Lumber">Lumber</option>
                <option value="Hardware">Hardware</option>
                <option value="Finishes">Finishes</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Origin</label>
              <select
                name="origin"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={formData.origin}
                onChange={handleInputChange}
              >
                <option value="Local">Local</option>
                <option value="Imported">Imported</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={formLoading}>
              {formLoading ? 'Verifying...' : currentItem ? 'Update Stock' : 'Add to Inventory'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove from Inventory"
      >
        <div className="pt-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to remove <strong>{currentItem?.name}</strong> from the system? This record will be permanently deleted.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
              Keep Item
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 bg-red-500 hover:bg-red-600 border-red-500 shadow-lg shadow-red-500/20" 
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? 'Removing...' : 'Confirm Remove'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockPage;
