import { Eye, Download, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const AuditLogTable = ({
  logs,
  loading,
  selectedLogs,
  onSelectAll,
  onSelectLog,
  onViewDetails,
  onDownloadSingle,
  currentPage,
  totalPages,
  totalLogs,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'Warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Success: 'bg-green-500/20 text-green-400 border-green-500/30',
      Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      Warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || ''} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  const getActionBadge = (action) => {
    const colors = {
      CREATE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      READ: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      UPDATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
      LOGIN: 'bg-green-500/20 text-green-400 border-green-500/30',
      LOGOUT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      LOGIN_FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const color = colors[action] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${color}`}>
        {action}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 shadow-xl text-center">
        <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg">No audit logs found</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedLogs.length === logs.length && logs.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Entity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-700/50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedLogs.includes(log.id)}
                    onChange={() => onSelectLog(log.id)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-white font-medium">
                      {log.userEmail || 'System'}
                    </div>
                    {log.userRole && (
                      <div className="text-slate-400 text-xs">
                        {log.userRole}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getActionBadge(log.action)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>{log.entity}</span>
                    {log.entityId && (
                      <span className="text-xs text-slate-500">#{log.entityId}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300 max-w-md truncate">
                  {log.description}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(log.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(log)}
                      className="p-2 hover:bg-slate-600 rounded-lg transition-colors duration-200 group"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    </button>
                    <button
                      onClick={() => onDownloadSingle(log)}
                      className="p-2 hover:bg-slate-600 rounded-lg transition-colors duration-200 group"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-slate-900 px-6 py-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalLogs)} of {totalLogs} logs
            </span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                      currentPage === pageNum
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;
