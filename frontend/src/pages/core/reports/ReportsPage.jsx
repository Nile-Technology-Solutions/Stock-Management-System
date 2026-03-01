/**
 * ReportsPage Component
 * Main page for displaying business reports with role-based access
 */

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ReportCard from '../../../components/common/ReportCard';
import ReportViewer from '../../../components/common/ReportViewer';
import { getReportsForRole } from '../../../config/reportConfig';
import { FileText } from '../../../components/icons';

const ReportsPage = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  // Get reports filtered by user role
  const reports = getReportsForRole(user?.role);

  const handleViewReport = (data, type) => {
    setSelectedReport(data);
    setReportType(type);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedReport(null);
    setReportType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 
                    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Reports
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          View and download business reports in various formats
        </p>
      </div>

      {/* Reports Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.type}
              config={report}
              onView={handleViewReport}
            />
          ))}
        </div>

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No Reports Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              You don't have access to any reports.
            </p>
          </div>
        )}
      </div>

      {/* Report Viewer Modal */}
      {showViewer && selectedReport && (
        <ReportViewer
          data={selectedReport}
          reportType={reportType}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default ReportsPage;
