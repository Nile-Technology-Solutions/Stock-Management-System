/**
 * StockReportView Component
 * Visualizes stock report data with charts and tables
 */

import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, AlertTriangle, TrendingUp } from '../../components/icons';

const StockReportView = ({ data }) => {
  if (!data || !data.materials) {
    return <div className="text-center py-8 text-slate-600 dark:text-slate-400">No data available</div>;
  }

  const { totalMaterials = 0, lowStockItems = 0, materials = [] } = data;

  // Prepare data for charts
  const stockLevelData = materials.slice(0, 10).map(item => ({
    name: (item.materialName || 'Unknown').length > 15 ? (item.materialName || 'Unknown').substring(0, 15) + '...' : (item.materialName || 'Unknown'),
    quantity: item.quantity || 0,
    minStock: item.minStockLevel || 0
  }));

  const stockStatusData = [
    { name: 'Normal Stock', value: totalMaterials - lowStockItems, color: '#10b981' },
    { name: 'Low Stock', value: lowStockItems, color: '#ef4444' }
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Materials</p>
              <p className="text-3xl font-bold mt-2">{totalMaterials}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold mt-2">{lowStockItems}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Healthy Stock</p>
              <p className="text-3xl font-bold mt-2">{totalMaterials - lowStockItems}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Top 10 Materials - Stock Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="quantity" fill="#3b82f6" name="Current Stock" />
              <Bar dataKey="minStock" fill="#ef4444" name="Min Stock Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Stock Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          All Materials
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Material</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Unit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Min Stock</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{item.materialName || 'Unknown'}</td>
                  <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{item.quantity || 0}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{item.unit || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{item.minStockLevel || 'N/A'}</td>
                  <td className="py-3 px-4">
                    {(item.quantity || 0) <= (item.minStockLevel || 0) ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockReportView;
