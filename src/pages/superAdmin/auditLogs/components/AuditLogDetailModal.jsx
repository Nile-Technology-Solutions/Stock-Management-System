import { X, Download, Calendar, User, Activity, Database, Globe, Monitor } from 'lucide-react';
import { format } from 'date-fns';

const AuditLogDetailModal = ({ log, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Audit Log Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Timestamp</span>
                </div>
                <p className="text-white font-semibold">
                  {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                </p>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Log ID</span>
                </div>
                <p className="text-white font-semibold">#{log.id}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">User Information</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Email</p>
                  <p className="text-white">{log.userEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Role</p>
                  <p className="text-white">{log.userRole || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">User ID</p>
                  <p className="text-white">{log.userId || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Action Details */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Action Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Action</p>
                  <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-medium">
                    {log.action}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
                    log.status === 'Success'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : log.status === 'Failed'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Entity</p>
                  <p className="text-white">{log.entity}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Entity ID</p>
                  <p className="text-white">{log.entityId || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Description</p>
              <p className="text-white">{log.description}</p>
            </div>

            {/* Technical Details */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">Technical Details</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">IP Address</p>
                  <p className="text-white font-mono text-sm">{log.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">User Agent</p>
                  <p className="text-white font-mono text-xs break-all">
                    {log.userAgent || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {log.metadata && (
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Additional Metadata</p>
                <pre className="text-white font-mono text-xs bg-slate-950 p-3 rounded overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetailModal;
