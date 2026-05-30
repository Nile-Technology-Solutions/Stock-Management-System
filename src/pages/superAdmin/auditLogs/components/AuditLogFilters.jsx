import { useState } from 'react';
import { X, Search } from 'lucide-react';

const AuditLogFilters = ({ filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const actions = [
    'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
    'PASSWORD_RESET', 'PASSWORD_CHANGE', 'ROLE_CHANGE', 'STATUS_CHANGE',
    'PAYMENT_INITIATED', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED',
    'ORDER_PLACED', 'ORDER_UPDATED', 'ORDER_CANCELLED',
    'STOCK_ADDED', 'STOCK_UPDATED', 'STOCK_DELETED',
    'PRODUCTION_STARTED', 'PRODUCTION_COMPLETED',
    'EXPORT_DATA', 'IMPORT_DATA', 'SETTINGS_CHANGED',
    'USER_CREATED', 'USER_UPDATED', 'USER_DELETED'
  ];

  const entities = [
    'User', 'Order', 'Product', 'Stock', 'Payment', 'Production',
    'News', 'Todo', 'Address', 'Category', 'Settings'
  ];

  const statuses = ['Success', 'Failed', 'Warning'];

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      action: '',
      entity: '',
      status: '',
      userId: '',
      startDate: '',
      endDate: '',
      search: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Search className="w-5 h-5" />
          Filter Audit Logs
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Action Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Action
          </label>
          <select
            value={localFilters.action}
            onChange={(e) => handleChange('action', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        {/* Entity Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Entity
          </label>
          <select
            value={localFilters.entity}
            onChange={(e) => handleChange('entity', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Entities</option>
            {entities.map(entity => (
              <option key={entity} value={entity}>{entity}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* User ID Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            User ID
          </label>
          <input
            type="number"
            value={localFilters.userId}
            onChange={(e) => handleChange('userId', e.target.value)}
            placeholder="Enter user ID"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Search
          </label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search description, email, entity..."
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default AuditLogFilters;
