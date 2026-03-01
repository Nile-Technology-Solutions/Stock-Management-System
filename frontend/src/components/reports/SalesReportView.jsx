/**
 * SalesReportView Component
 * Visualizes sales report data with charts and tables
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Package, Award } from '../../components/icons';

const SalesReportView = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-slate-300">No data available</div>;
  }

  const { period, totalSales = 0, topProducts = [] } = data;

  // Prepare top products data for chart
  const topProductsData = topProducts.slice(0, 10).map(product => ({
    name: (product.productName || 'Unknown').length > 15 ? (product.productName || 'Unknown').substring(0, 15) + '...' : (product.productName || 'Unknown'),
    sales: product.salesCount || 0,
    revenue: product.revenue || 0
  }));

  // Calculate total revenue from top products
  const totalRevenue = topProducts.reduce((sum, product) => sum + (product.revenue || 0), 0);
  const totalUnits = topProducts.reduce((sum, product) => sum + (product.salesCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Period Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">Sales Report</h2>
        <p className="text-blue-100 text-lg">Period: {period || 'All Time'}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-4xl font-bold">ETB {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Sales</p>
              <p className="text-4xl font-bold">{totalSales || 0}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Units Sold</p>
              <p className="text-4xl font-bold">{totalUnits}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Package className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Sales Count */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            Top Products by Units Sold
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="Units Sold" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products by Revenue */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
            Top Products by Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                formatter={(value) => `ETB ${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue (ETB)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Top Selling Products
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Rank</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Product Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Units Sold</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Revenue</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => {
                const avgPrice = (product.salesCount || 0) > 0 ? ((product.revenue || 0) / (product.salesCount || 0)).toFixed(2) : 0;
                return (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/50' : ''}
                        ${index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg shadow-slate-500/50' : ''}
                        ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/50' : ''}
                        ${index > 2 ? 'bg-white/10 text-slate-300' : ''}
                      `}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-white font-medium">
                      {product.productName || 'Unknown'}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300">
                      {product.salesCount || 0}
                    </td>
                    <td className="py-4 px-4 text-sm text-white font-semibold">
                      ETB {(product.revenue || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300">
                      ETB {avgPrice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReportView;
