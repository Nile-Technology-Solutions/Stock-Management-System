/**
 * Reports Service for SuperAdmin
 * Integrates with SuperAdmin API for all report endpoints
 */

import { superAdminApi } from '../../../services/superAdminApi';

/**
 * Get stock report
 * @param {Object} params - Query parameters (timeRange, etc.)
 * @returns {Promise<Object>} Stock report data
 */
export const getStockReport = async (params = {}) => {
  try {
    return await superAdminApi.reports.stock(params);
  } catch (error) {
    console.error('Failed to fetch stock report:', error);
    throw error;
  }
};

/**
 * Get production report
 * @param {Object} params - Query parameters (timeRange, etc.)
 * @returns {Promise<Object>} Production report data
 */
export const getProductionReport = async (params = {}) => {
  try {
    return await superAdminApi.reports.production(params);
  } catch (error) {
    console.error('Failed to fetch production report:', error);
    throw error;
  }
};

/**
 * Get order report
 * @param {Object} params - Query parameters (timeRange, etc.)
 * @returns {Promise<Object>} Order report data
 */
export const getOrderReport = async (params = {}) => {
  try {
    return await superAdminApi.reports.orders(params);
  } catch (error) {
    console.error('Failed to fetch order report:', error);
    throw error;
  }
};

/**
 * Get payment report
 * @param {Object} params - Query parameters (timeRange, etc.)
 * @returns {Promise<Object>} Payment report data
 */
export const getPaymentReport = async (params = {}) => {
  try {
    return await superAdminApi.reports.payments(params);
  } catch (error) {
    console.error('Failed to fetch payment report:', error);
    throw error;
  }
};

/**
 * Get sales report
 * @param {Object} params - Query parameters (timeRange, etc.)
 * @returns {Promise<Object>} Sales report data
 */
export const getSalesReport = async (params = {}) => {
  try {
    return await superAdminApi.reports.sales(params);
  } catch (error) {
    console.error('Failed to fetch sales report:', error);
    throw error;
  }
};

/**
 * Get all reports summary
 * @param {Object} params - Query parameters (timeRange, etc.)
 * @returns {Promise<Object>} All reports summary
 */
export const getAllReportsSummary = async (params = {}) => {
  try {
    const [stock, production, orders, payments, sales] = await Promise.all([
      getStockReport(params),
      getProductionReport(params),
      getOrderReport(params),
      getPaymentReport(params),
      getSalesReport(params)
    ]);

    return {
      timeRange: params.timeRange || '7d',
      summary: {
        stock: stock.summary,
        production: production.summary,
        orders: orders.summary,
        payments: payments.summary,
        sales: sales.summary
      },
      details: {
        stock,
        production,
        orders,
        payments,
        sales
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch reports summary:', error);
    throw error;
  }
};

/**
 * Get financial reports
 * @param {Object} params - Query parameters (timeRange, etc.)
 * @returns {Promise<Object>} Financial reports data
 */
export const getFinancialReports = async (params = {}) => {
  try {
    const [revenue, summary] = await Promise.all([
      superAdminApi.financial.getRevenue(params),
      superAdminApi.financial.getSummary(params)
    ]);

    return {
      revenue,
      summary,
      timeRange: params.timeRange || '7d',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch financial reports:', error);
    throw error;
  }
};

/**
 * Export report to different formats
 * @param {string} reportType - Type of report (stock, production, orders, payments, sales)
 * @param {string} format - Export format (csv, excel, pdf)
 * @param {Object} params - Query parameters
 * @returns {Promise<Blob>} Exported file
 */
export const exportReport = async (reportType, format, params = {}) => {
  try {
    // This would call a different endpoint for exporting
    // For now, we'll simulate the export
    const reportData = await getReportByType(reportType, params);

    // Convert to blob based on format
    switch (format.toLowerCase()) {
      case 'csv':
        return new Blob([convertToCSV(reportData)], { type: 'text/csv' });
      case 'excel':
        return new Blob([convertToExcel(reportData)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      case 'pdf':
        return new Blob([convertToPDF(reportData)], { type: 'application/pdf' });
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Failed to export report:', error);
    throw error;
  }
};

/**
 * Helper function to get report by type
 * @param {string} reportType - Report type
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Report data
 */
const getReportByType = async (reportType, params) => {
  switch (reportType.toLowerCase()) {
    case 'stock':
      return await getStockReport(params);
    case 'production':
      return await getProductionReport(params);
    case 'orders':
      return await getOrderReport(params);
    case 'payments':
      return await getPaymentReport(params);
    case 'sales':
      return await getSalesReport(params);
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }
};

/**
 * Convert data to CSV format
 * @param {Object} data - Report data
 * @returns {string} CSV string
 */
const convertToCSV = (data) => {
  // Simplified CSV conversion - in real implementation, use a library
  const headers = Object.keys(data).join(',');
  const values = Object.values(data).join(',');
  return `${headers}\n${values}`;
};

/**
 * Convert data to Excel format
 * @param {Object} data - Report data
 * @returns {ArrayBuffer} Excel data
 */
const convertToExcel = (data) => {
  // Simplified Excel conversion - in real implementation, use a library like xlsx
  return JSON.stringify(data);
};

/**
 * Convert data to PDF format
 * @param {Object} data - Report data
 * @returns {ArrayBuffer} PDF data
 */
const convertToPDF = (data) => {
  // Simplified PDF conversion - in real implementation, use a library like jsPDF
  return JSON.stringify(data);
};

export default {
  getStockReport,
  getProductionReport,
  getOrderReport,
  getPaymentReport,
  getSalesReport,
  getAllReportsSummary,
  getFinancialReports,
  exportReport
};
