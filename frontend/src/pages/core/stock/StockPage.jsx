import { useState, useEffect, useCallback } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import ImageUpload from '../../../components/common/ImageUpload';
import { Database, Package, RefreshCw, Plus, Search, Filter, Edit3, Trash2, AlertTriangle, Layers } from '../../../components/icons';
import { useAuth } from '../../../context/AuthContext';
import { stockApi, stockApiHelpers } from '../../../services/stockApi';

const CATEGORIES = [
  { label: 'Boards', value: 1 },
  { label: 'Lumber', value: 2 },
  { label: 'Hardware', value: 3 },
  { label: 'Finishes', value: 4 },
];

const emptyForm = {
  name: '',
  quantity: '',
  categoryId: '1',
  origin: 'Local',
  thickness: '',
  size: '',
  color: '',
  laminated: false,
  typeNote: '',
  images: [],
};

const StockPage = () => {
  const { hasRole } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const fetchStock = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const response = await stockApi.getAllStock();
      if (response.success) {
        const rawData = response.data;
        const items = Array.isArray(rawData) ? rawData : (rawData?.items || rawData?.data || []);
        setStockItems(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error('Failed to fetch stock:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleOpenAddModal = () => {
    setCurrentItem(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name || '',
      quantity: String(item.quantity ?? ''),
      categoryId: String(item.categoryId || item.category?.id || '1'),
      origin: item.origin || 'Local',
      thickness: item.thickness || '',
      size: item.size || '',
      color: item.color || '',
      laminated: item.laminated === true,
      typeNote: item.typeNote || '',
      images: item.images || [],
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const validateForm = () => {
    const { valid, errors } = stockApiHelpers.validateStockData({
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
    });
    if (!valid) {
      alert(errors.join('\n'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      const itemData = stockApiHelpers.formatStockForApi(formData);
      let response;
      if (currentItem) {
        response = await stockApi.updateStock(currentItem.id, itemData);
      } else {
        response = await stockApi.createStock(itemData);
      }
      if (response.success) {
        setIsModalOpen(false);
        fetchStock(true);
      } else {
        alert(response.error || 'Failed to save stock item');
      }
    } catch (error) {
      console.error('Error saving stock:', error);
      alert(error.message || 'An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      const response = await stockApi.deleteStock(currentItem.id);
      if (response.success) {
        setIsDeleteModalOpen(false);
        fetchStock(true);
      } else {
        alert(response.error || 'Failed to delete stock item');
      }
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert('An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const getCategoryLabel = (item) => {
    if (item.category?.name) return item.category.name;
    const cat = CATEGORIES.find(c => c.value === item.categoryId);
    return cat?.label || item.category || '—';
  };

  const filteredItems = stockItems.filter(item => {
    const catLabel = getCategoryLabel(item);
    const matchesSearch =
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      catLabel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || catLabel === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      header: 'Material Name',
      accessor: 'name',
      render: (value, item) => {
        const name = typeof value === 'object' ? (value?.name || JSON.stringify(value)) : value;
        const origin = item.origin || '—';
        const catLabel = getCategoryLabel(item);
        const hasImages = item.images && item.images.length > 0;
        const imageUrl = hasImages ? item.images[0].url : null;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <Layers className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">{name}</div>
              <div className="text-xs text-slate-500">{catLabel} • {origin}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'In Stock',
      accessor: 'quantity',
      render: (qty) => {
        const numQty = Number(qty ?? 0);
        return (
          <div className="flex items-center gap-2">
            <span className={`font-bold ${numQty < 20 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {numQty}
            </span>
            {numQty < 20 && (
              <div className="group relative">
                <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Low Stock Warning!
                </div>
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Details',
      accessor: 'size',
      render: (size, item) => (
        <div className="text-xs text-slate-500 space-y-0.5">
          {size && <div>Size: {size}</div>}
          {item.thickness && <div>Thickness: {item.thickness}</div>}
          {item.laminated && <div className="text-amber-600 font-medium">Laminated</div>}
        </div>
      )
    },
    {
      header: 'Last Updated',
      accessor: 'lastUpdated',
      render: (date) => {
        if (!date) return 'N/A';
        try { return new Date(date).toLocaleDateString(); } catch { return String(date); }
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenEditModal(item)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenDeleteModal(item)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
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
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/25">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Inventory
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time raw materials and inventory control
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => fetchStock(true)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" onClick={handleOpenAddModal} className="flex items-center gap-2 shadow-lg shadow-amber-500/25 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Plus className="w-5 h-5" />
              Add Material
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Analytics Mini-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stockItems.length}</div>
            <div className="text-xs text-slate-500">Total Items</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stockItems.filter(i => i.quantity < 20).length}</div>
            <div className="text-xs text-slate-500">Low Stock</div>
          </div>
        </GlassCard>
      </div>

      {/* Table */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by material name or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.label}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest">Loading Inventory...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredItems} pagination={true} pageSize={6} />
        )}
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Update Stock Item' : 'Add New Material'}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Material Name <span className="text-red-500">*</span>
            </label>
            <input required name="name" type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
              value={formData.name} onChange={handleInputChange} placeholder="e.g. Pine Board 18mm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity <span className="text-red-500">*</span></label>
              <input required name="quantity" type="number" min="0"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
                value={formData.quantity} onChange={handleInputChange} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Size</label>
              <input name="size" type="text"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
                value={formData.size} onChange={handleInputChange} placeholder="e.g. 120x240cm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select name="categoryId"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
                value={formData.categoryId} onChange={handleInputChange}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Origin <span className="text-red-500">*</span></label>
              <select name="origin"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
                value={formData.origin} onChange={handleInputChange}>
                <option value="Local">Local</option>
                <option value="Imported">Imported</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
              <input name="color" type="text"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
                value={formData.color} onChange={handleInputChange} placeholder="e.g. Natural Oak" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Thickness</label>
              <input name="thickness" type="text"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
                value={formData.thickness} onChange={handleInputChange} placeholder="e.g. 18mm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type Note</label>
            <input name="typeNote" type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
              value={formData.typeNote} onChange={handleInputChange} placeholder="Optional notes about the material type" />
          </div>

          <div className="flex items-center gap-3 py-1">
            <input id="laminated" name="laminated" type="checkbox" className="w-4 h-4 accent-amber-500 rounded"
              checked={formData.laminated} onChange={handleInputChange} />
            <label htmlFor="laminated" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Laminated surface</label>
          </div>

          <ImageUpload images={formData.images} onChange={handleImagesChange} maxImages={5} label="Material Images" />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={formLoading}>
              {formLoading ? 'Saving...' : currentItem ? 'Update Stock' : 'Add to Inventory'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Remove from Inventory">
        <div className="pt-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to remove <strong>{currentItem?.name}</strong> from the system? This record will be permanently deleted.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Keep Item</Button>
            <Button variant="primary" className="flex-1 bg-red-500 hover:bg-red-600 border-red-500 shadow-lg shadow-red-500/20"
              onClick={handleDelete} disabled={formLoading}>
              {formLoading ? 'Removing...' : 'Confirm Remove'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockPage;