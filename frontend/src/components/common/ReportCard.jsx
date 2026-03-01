/**
 * ReportCard Component
 * Reusable card component for individual report types
 */

import React, { useState, useEffect } from 'react';
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
      onView(data, config.type); // Pass report type
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
    <GlassCard title={config.title} className="hover:shadow-2xl transition-all duration-300">
      {/* Date Range Filter */}
      {config.hasDateFilter && (
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      )}

      {/* Validation Error */}
      {validationError && (
        <div 
          className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 
                     rounded-lg text-red-700 dark:text-red-300 text-sm animate-pulse"
          role="alert"
        >
          {validationError}
        </div>
      )}

      {/* API Error */}
      {error && (
        <div 
          className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 
                     rounded-lg text-red-700 dark:text-red-300 text-sm"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div 
          className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 
                     rounded-lg text-green-700 dark:text-green-300 text-sm animate-pulse"
          role="status"
          aria-live="polite"
        >
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleView}
          loading={loading.view}
          disabled={isDisabled}
          variant="primary"
          className="w-full group relative overflow-hidden"
          ariaLabel={`View ${config.title}`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group"
            ariaLabel={`Download ${config.title} as CSV`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group"
            ariaLabel={`Download ${config.title} as PDF`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF
            </span>
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ReportCard;
