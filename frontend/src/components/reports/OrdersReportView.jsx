/**
 * OrdersReportView Component
 * Visualizes orders report data with charts and tables
 */

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShoppingCart, DollarSign, TrendingUp, Package } from '../../components/icons';

const OrdersReportView = ({ data }) => {
  if (!data || !data.orders) {
    return <div className="text-center py-8 text-slate-600 dark:text-slate-400">No data available</div>;
  }

  const { totalOrders = 0, totalRevenue = 0, orders = [] } = data;

  // Status distribution
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Revenue by product (top 10)
  const productRevenue = {};
  orders.forEach(order => {
    const product = order.productName || 'Unknown';
    const amount = order.totalAmount || 0;
    productRevenue[product] = (productRevenue[product] || 0) + amount;
  });

  const revenueData = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([product, revenue]) => ({
      name: product.length > 15 ? product.substring(0, 15) + '...' : product,
      revenue: revenue
    }));

  // Average order value
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{totalOrders}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">ETB {totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold mt-2">ETB {avgOrderValue}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Product */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Top 10 Products by Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => `ETB ${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue (ETB)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          All Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Product</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">#{order.id || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{order.customerName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{order.productName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{order.quantity || 0}</td>
                  <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100 font-medium">
                    ETB {(order.totalAmount || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                      ${order.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                      ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                      ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
                    `}>
                      {order.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
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

export default OrdersReportView;
