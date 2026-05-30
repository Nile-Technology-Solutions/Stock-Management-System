import { useState } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { DollarSign, CreditCard, RefreshCw, Download } from '../../../components/icons';

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="standard">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Payment Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Financial transactions and revenue tracking
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Coming Soon */}
      <GlassCard variant="standard">
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Payments Module
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Full payment management features coming soon...
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default PaymentsPage;
