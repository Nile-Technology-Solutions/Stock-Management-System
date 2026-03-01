/**
 * ReportCard Component
 * Reusable card component for individual report types with futuristic design
 */

import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import DateRangeFilter from './DateRangeFilter';
import { getReport, downloadReport } from '../../services/reportApi';

const ReportCard = ({ config, onView }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState({
    view: false,
    csv: false,
    pdf: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Auto-dismiss success messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Validate date range
   */
  const validateDates = () => {
    if (fromDate && toDate) {
      if (fromDate > toDate) {
        setValidationError('From Date must be before To Date');
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  /**
   * Build API parameters
   */
  const buildParams = (format) => {
    const params = { format };
    if (fromDate) {
      params.from_date = fromDate;
    }
    if (toDate) {
      params.to_date = toDate;
    }
    return params;
  };

  /**
   * Handle View action
   */
  const handleView = async () => {
    if (!validateDates()) {
      return;
    }

    setLoading({ ...loading, view: true });
    setError(null);

    try {
      const params = buildParams('json');
      const data = await getReport(config.endpoint, params);
      onView(data, config.type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, view: false });
    }
  };

  /**
   * Handle Download action
   */
  const handleDownload = async (format) => {
    if (!validateDates()) {
      return;
    }

    const loadingKey = format;
    setLoading({ ...loading, [loadingKey]: true });
    setError(null);
    setSuccess(null);

    try {
      const params = buildParams(format);
      const blob = await downloadReport(config.endpoint, params);
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `${config.type}_report_${timestamp}.${format}`;
      
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`${format.toUpperCase()} downloaded successfully`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, [loadingKey]: false });
    }
  };

  const isDisabled = loading.view || loading.csv || loading.pdf || !!validationError;

  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500"></div>
      
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
        {/* Card Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Date Range Filter */}
        {config.hasDateFilter && (
          <div className="mb-4">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div 
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 backdrop-blur-sm
                       rounded-lg text-red-200 text-sm animate-pulse"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {validationError}
            </div>
          </div>
        )}

        {/* API Error */}
        {error && (
          <div 
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 backdrop-blur-sm
                       rounded-lg text-red-200 text-sm"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div 
            className="mb-4 p-3 bg-green-500/20 border border-green-500/50 backdrop-blur-sm
                       rounded-lg text-green-200 text-sm animate-pulse"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleView}
            loading={loading.view}
            disabled={isDisabled}
            variant="primary"
            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0"
            ariaLabel={`View ${config.title}`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
              <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Report
            </span>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleDownload('csv')}
              loading={loading.csv}
              disabled={isDisabled}
              variant="secondary"
              className="group/btn backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              ariaLabel={`Download ${config.title} as CSV`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </span>
            </Button>

            <Button
              onClick={() => handleDownload('pdf')}
              loading={loading.pdf}
              disabled={isDisabled}
              variant="secondary"
              className="group/btn backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              ariaLabel={`Download ${config.title} as PDF`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
