import { useState, useEffect } from 'react';
import { 
  Shield, 
  Download, 
  Filter, 
  Search, 
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';
import auditLogService from '../../../services/auditLogService';
import AuditLogFilters from './components/AuditLogFilters';
import AuditLogTable from './components/AuditLogTable';
import AuditLogStats from './components/AuditLogStats';
import AuditLogDetailModal from './components/AuditLogDetailModal';
import { generateAuditLogPDF, generateBulkAuditLogPDF } from '../../../utils/pdfGenerator';
import toast from 'react-hot-toast';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [limit, setLimit] = useState(50);

  // Filters
  const [filters, setFilters] = useState({
    action: '',
    entity: '',
    status: '',
    userId: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  // Selected logs for bulk operations
  const [selectedLogs, setSelectedLogs] = useState([]);

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, limit, filters]);

  useEffect(() => {
    fetchStats();
  }, [filters.startDate, filters.endDate]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await auditLogService.getAuditLogs(params);
      setLogs(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalLogs(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await auditLogService.getAuditLogStats(
        filters.startDate,
        filters.endDate
      );
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const handleDownloadSingle = async (log) => {
    try {
      await generateAuditLogPDF(log);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadBulk = async () => {
    if (selectedLogs.length === 0) {
      toast.error('Please select logs to download');
      return;
    }

    try {
      const logsToDownload = logs.filter(log => selectedLogs.includes(log.id));
      await generateBulkAuditLogPDF(logsToDownload);
      toast.success(`Downloaded ${selectedLogs.length} logs as PDF`);
      setSelectedLogs([]);
    } catch (error) {
      console.error('Failed to generate bulk PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadPage = async () => {
    try {
      await generateBulkAuditLogPDF(logs, `Audit_Logs_Page_${currentPage}`);
      toast.success('Page downloaded as PDF');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadFiltered = async () => {
    try {
      // Fetch all logs with current filters (no pagination)
      const params = { ...filters, limit: 10000 };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await auditLogService.getAuditLogs(params);
      await generateBulkAuditLogPDF(response.data, 'Filtered_Audit_Logs');
      toast.success('Filtered logs downloaded as PDF');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleRefresh = () => {
    fetchAuditLogs();
    fetchStats();
    toast.success('Data refreshed');
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(logs.map(log => log.id));
    }
  };

  const handleSelectLog = (logId) => {
    setSelectedLogs(prev => {
      if (prev.includes(logId)) {
        return prev.filter(id => id !== logId);
      } else {
        return [...prev, logId];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Audit Logs
              </h1>
              <p className="text-slate-400">
                System activity monitoring and security tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg ${
                showFilters
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="relative group">
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={handleDownloadPage}
                  className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2 rounded-t-lg"
                >
                  <FileText className="w-4 h-4" />
                  Current Page
                </button>
                <button
                  onClick={handleDownloadBulk}
                  disabled={selectedLogs.length === 0}
                  className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Selected ({selectedLogs.length})
                </button>
                <button
                  onClick={handleDownloadFiltered}
                  className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2 rounded-b-lg"
                >
                  <Filter className="w-4 h-4" />
                  All Filtered Results
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <AuditLogStats stats={stats} loading={statsLoading} />
      </div>

      {/* Filters */}
      {showFilters && (
        <AuditLogFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Table */}
      <AuditLogTable
        logs={logs}
        loading={loading}
        selectedLogs={selectedLogs}
        onSelectAll={handleSelectAll}
        onSelectLog={handleSelectLog}
        onViewDetails={handleViewDetails}
        onDownloadSingle={handleDownloadSingle}
        currentPage={currentPage}
        totalPages={totalPages}
        totalLogs={totalLogs}
        limit={limit}
        onPageChange={setCurrentPage}
        onLimitChange={setLimit}
      />

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <AuditLogDetailModal
          log={selectedLog}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedLog(null);
          }}
          onDownload={() => handleDownloadSingle(selectedLog)}
        />
      )}
    </div>
  );
};

export default AuditLogsPage;
