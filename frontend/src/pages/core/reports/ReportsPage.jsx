/**
 * ReportsPage Component
 * Main page for displaying business reports with role-based access
 * Modern futuristic design with glassmorphism effects
 */

import { useState } from 'react';
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Business Intelligence Reports
                </h1>
                <p className="text-slate-300 mt-1">
                  Real-time analytics and insights from your database
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="max-w-7xl mx-auto">
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.type}
                  className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <ReportCard
                    config={report}
                    onView={handleViewReport}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
              <div className="inline-flex p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full mb-6">
                <FileText className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Reports Available
              </h3>
              <p className="text-slate-400 text-lg">
                You don't have access to any reports at this time.
              </p>
            </div>
          )}
        </div>
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
