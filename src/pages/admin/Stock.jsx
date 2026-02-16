import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStock } from '../../hooks/useStock';
import { 
  Package, 
  Plus, 
  Download, 
  Search, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Eye,
  Activity,
  Database,
  Layers,
  RefreshCw,
  ArrowUpDown,
  Calendar,
  MapPin
} from 'lucide-react';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import GlassModal from '../../components/common/GlassModal';
import { exportToExcel } from '../../utils/excelExport';

const Stock = () => {
  const { hasRole } = useAuth();
  const { 
    stockItems, 
    loading, 
    origins, 
    stockStats, 
    filterStock, 
    addStockItem,
    updateStockItem,
    deleteStockItem
  } = useStock();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [viewMode, setViewMode] = useState('table');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Form state - adapted for furniture materials
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    color: '',
    size: '',
    thickness: '',
    laminated: false,
    origin: '',
    typeNote: ''
  });

  // Advanced filtering and sorting
  const filteredAndSortedItems = useMemo(() => {
    let filtered = filterStock(searchTerm, originFilter, statusFilter);
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [searchTerm, originFilter, statusFilter, sortConfig, filterStock]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      color: '',
      size: '',
      thickness: '',
      laminated: false,
      origin: '',
      typeNote: ''
    });
  };

  const handleAddItem = async () => {
    const result = await addStockItem({
      ...formData,
      quantity: parseInt(formData.quantity) || 0
    });
    
    if (result.success) {
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditItem = async () => {
    const result = await updateStockItem(selectedItem.id, {
      ...formData,
      quantity: parseInt(formData.quantity) || 0
    });
    
    if (result.success) {
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
    }
  };

  const handleDeleteItem = async () => {
    const result = await deleteStockItem(selectedItem.id);
    if (result.success) {
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  // Excel export functionality
  const handleExportToExcel = () => {
    const exportData = filteredAndSortedItems.map(item => ({
      'Material Name': item.name,
      'Quantity': item.quantity,
      'Color': item.color || 'N/A',
      'Size': item.size || 'N/A',
      'Thickness': item.thickness || 'N/A',
      'Laminated': item.laminated ? 'Yes' : 'No',
      'Origin': item.origin || 'N/A',
      'Type Note': item.typeNote || 'N/A',
      'Status': item.status,
      'Last Updated': new Date(item.lastUpdated).toLocaleDateString()
    }));

    exportToExcel(exportData, `stock-materials-${new Date().toISOString().split('T')[0]}`);
  };

  // Modal handlers
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      color: item.color || '',
      size: item.size || '',
      thickness: item.thickness || '',
      laminated: item.laminated || false,
      origin: item.origin || '',
      typeNote: item.typeNote || ''
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Raw Materials Inventory</h1>
              <p className="text-slate-600 mt-1">Furniture manufacturing stock management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50/50 rounded-lg">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-slate-700">System Online</span>
            </div>
            <Button
              variant="glass-secondary"
              onClick={() => window.location.reload()}
              className="p-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Materials</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stockStats.totalItems}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">Active inventory</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Normal Stock</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stockStats.normalStockItems}</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">Healthy levels</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stockStats.lowStockItems}</p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600 font-medium">Needs attention</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Quantity</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stockStats.totalQuantity}</p>
              <div className="flex items-center mt-2">
                <BarChart3 className="w-4 h-4 text-cyan-500 mr-1" />
                <span className="text-sm text-cyan-600 font-medium">Units in stock</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search materials, colors, sizes..."
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
              />
            </div>
            
            <Select
              value={originFilter}
              onChange={setOriginFilter}
              options={origins.map(origin => ({ value: origin, label: origin }))}
              placeholder="All Origins"
              className="w-full sm:w-48"
            />
            
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'low', label: 'Low Stock' },
                { value: 'critical', label: 'Critical' }
              ]}
              placeholder="All Status"
              className="w-full sm:w-48"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-50/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-cyan-400 text-white shadow-lg' 
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-cyan-400 text-white shadow-lg' 
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <Package className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="glass-secondary"
              onClick={handleExportToExcel}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </Button>
            
            <Button
              variant="primary"
              onClick={openAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add Material</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Raw Materials</h3>
              <div className="text-sm text-slate-600">
                {filteredAndSortedItems.length} of {stockItems.length} materials
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Material</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Quantity</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Specifications
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('origin')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Origin</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                        <span className="text-slate-600">Loading materials...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSortedItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <Package className="w-12 h-12 text-slate-300" />
                        <div>
                          <p className="text-lg font-medium text-slate-900">No materials found</p>
                          <p className="text-slate-600">Try adjusting your search or filters</p>
                        </div>
                        <Button variant="primary" onClick={openAddModal}>
                          Add First Material
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => openDetailsModal(item)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.name}</div>
                            {item.color && (
                              <div className="text-xs text-slate-500">Color: {item.color}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 space-y-1">
                          {item.size && <div>Size: {item.size}</div>}
                          {item.thickness && <div>Thickness: {item.thickness}</div>}
                          {item.laminated && (
                            <Badge variant="secondary" size="small" className="bg-blue-100 text-blue-700">
                              Laminated
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.origin && (
                          <Badge variant="secondary" size="small" className="bg-slate-100 text-slate-700">
                            {item.origin}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {item.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {item.status === 'low' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {item.status === 'normal' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetailsModal(item);
                            }}
                            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(item);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {hasRole('super_admin') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(item);
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-200 cursor-pointer"
              onClick={() => openDetailsModal(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{item.name}</h3>
                    {item.color && <p className="text-xs text-slate-500">{item.color}</p>}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {item.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {item.status === 'low' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {item.status === 'normal' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Quantity</span>
                  <span className="text-sm font-medium text-slate-900">{item.quantity}</span>
                </div>
                
                {item.size && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Size</span>
                    <span className="text-sm font-medium text-slate-900">{item.size}</span>
                  </div>
                )}

                {item.thickness && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Thickness</span>
                    <span className="text-sm font-medium text-slate-900">{item.thickness}</span>
                  </div>
                )}

                {item.origin && (
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{item.origin}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-white/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(item);
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {hasRole('super_admin') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(item);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Material Modal */}
      <GlassModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Material"
        size="large"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Material Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Laminated MDF Board"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="Enter quantity"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Dark Oak"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., 1220mm x 2440mm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Thickness</label>
              <input
                type="text"
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., 18mm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Origin</label>
              <select
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
              >
                <option value="">Select origin</option>
                <option value="Imported">Imported</option>
                <option value="Local">Local</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.laminated}
                onChange={(e) => setFormData({ ...formData, laminated: e.target.checked })}
                className="rounded border-slate-300 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-sm font-medium text-slate-700">Laminated</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Type Note</label>
            <textarea
              value={formData.typeNote}
              onChange={(e) => setFormData({ ...formData, typeNote: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
              placeholder="e.g., High-density water resistant"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
            <Button 
              variant="glass-secondary" 
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddItem}
              disabled={!formData.name || !formData.quantity}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>
      </GlassModal>

      {/* Edit Material Modal */}
      <GlassModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Material"
        size="large"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Material Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Laminated MDF Board"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="Enter quantity"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Dark Oak"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., 1220mm x 2440mm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Thickness</label>
              <input
                type="text"
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., 18mm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Origin</label>
              <select
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
              >
                <option value="">Select origin</option>
                <option value="Imported">Imported</option>
                <option value="Local">Local</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.laminated}
                onChange={(e) => setFormData({ ...formData, laminated: e.target.checked })}
                className="rounded border-slate-300 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-sm font-medium text-slate-700">Laminated</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Type Note</label>
            <textarea
              value={formData.typeNote}
              onChange={(e) => setFormData({ ...formData, typeNote: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
              placeholder="e.g., High-density water resistant"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
            <Button 
              variant="glass-secondary" 
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleEditItem}
              disabled={!formData.name || !formData.quantity}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Update Material
            </Button>
          </div>
        </div>
      </GlassModal>

      {/* Material Details Modal */}
      <GlassModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Material Details"
        size="large"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedItem.name}</h3>
                  {selectedItem.color && (
                    <p className="text-slate-600">Color: {selectedItem.color}</p>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status === 'critical' && <AlertTriangle className="w-4 h-4 mr-1" />}
                {selectedItem.status === 'low' && <AlertTriangle className="w-4 h-4 mr-1" />}
                {selectedItem.status === 'normal' && <CheckCircle className="w-4 h-4 mr-1" />}
                {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
              </span>
            </div>

            <div className="bg-slate-50/50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Current Quantity</span>
                <span className="text-2xl font-bold text-slate-900">{selectedItem.quantity}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Specifications</h4>
                <div className="space-y-3">
                  {selectedItem.size && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Size:</span>
                      <span className="font-medium text-slate-900">{selectedItem.size}</span>
                    </div>
                  )}
                  {selectedItem.thickness && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Thickness:</span>
                      <span className="font-medium text-slate-900">{selectedItem.thickness}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Laminated:</span>
                    <span className="font-medium text-slate-900">{selectedItem.laminated ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Additional Information</h4>
                <div className="space-y-3">
                  {selectedItem.origin && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Origin:</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-900">{selectedItem.origin}</span>
                      </div>
                    </div>
                  )}
                  {selectedItem.lastUpdated && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Updated:</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-900">
                          {new Date(selectedItem.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedItem.typeNote && (
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900">Type Note</h4>
                <p className="text-slate-600 bg-slate-50/50 rounded-lg p-3">
                  {selectedItem.typeNote}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
              <Button 
                variant="glass-secondary" 
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowDetailsModal(false);
                  openEditModal(selectedItem);
                }}
                className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Material
              </Button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Material"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">
                  Delete "{selectedItem.name}"?
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  This action cannot be undone. The material will be permanently removed from your inventory.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Warning</p>
                  <p className="text-sm text-red-700">
                    You are about to delete a material with {selectedItem.quantity} units in stock.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
              <Button 
                variant="glass-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteItem}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Material
              </Button>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
};

export default Stock;
