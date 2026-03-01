/**
 * ReportViewer Component
 * Modal component for displaying report data with visualizations
 */

import React, { useEffect } from 'react';
import GlassModal from './GlassModal';
import StockReportView from '../reports/StockReportView';
import ProductionReportView from '../reports/ProductionReportView';
import OrdersReportView from '../reports/OrdersReportView';
import PaymentsReportView from '../reports/PaymentsReportView';
import SalesReportView from '../reports/SalesReportView';

const ReportViewer = ({ data, reportType, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Determine which report view to render based on data structure
  const renderReportView = () => {
    if (!data) {
      return <div className="text-center py-8 text-slate-600 dark:text-slate-400">No data available</div>;
    }

    // Detect report type from data structure or use reportType prop
    if (reportType === 'stock' || data.materials) {
      return <StockReportView data={data} />;
    } else if (reportType === 'production' || data.records) {
      return <ProductionReportView data={data} />;
    } else if (reportType === 'orders' || (data.orders && data.totalRevenue !== undefined)) {
      return <OrdersReportView data={data} />;
    } else if (reportType === 'payments' || data.payments) {
      return <PaymentsReportView data={data} />;
    } else if (reportType === 'sales' || data.topProducts) {
      return <SalesReportView data={data} />;
    }

    // Fallback to JSON view
    const formattedData = JSON.stringify(data, null, 2);
    return (
      <div 
        className="max-h-[60vh] overflow-auto rounded-lg bg-gray-900 p-4"
        role="region"
        aria-label="Report data content"
      >
        <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words">
          <code>{formattedData}</code>
        </pre>
      </div>
    );
  };

  return (
    <GlassModal
      isOpen={true}
      onClose={onClose}
      title=""
      size="xlarge"
    >
      <div 
        className="max-h-[75vh] overflow-auto"
        role="region"
        aria-label="Report visualization"
      >
        {renderReportView()}
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-200 dark:border-slate-700 pt-4">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                     transition-colors duration-200 font-medium shadow-lg"
          aria-label="Close report viewer"
        >
          Close
        </button>
      </div>
    </GlassModal>
  );
};

export default ReportViewer;
