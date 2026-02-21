import { useState, useRef } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import { Settings, Activity, RefreshCw, Plus, Image as ImageIcon, Upload, CheckCircle2, XCircle, Clock, Camera } from '../../../components/icons';
import { mockProduction } from '../../../services/mockData';

const ProductionPage = () => {
  const [batches, setBatches] = useState(mockProduction);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleOpenUpload = (batch) => {
    setSelectedBatch(batch);
    setPreviews([]);
    setUploadProgress(0);
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate real FormData and progress
    const formData = new FormData();
    // In a real app: files.forEach(file => formData.append('photos', file));
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Update local state to show "Completed" if it was under process (demo logic)
    setBatches(prev => prev.map(b => 
      b.id === selectedBatch.id ? { ...b, status: 'Completed', photos: previews } : b
    ));
    
    setIsUploading(false);
    setTimeout(() => {
      setIsUploadModalOpen(false);
    }, 500);
  };

  const columns = [
    {
      header: 'Batch ID',
      accessor: 'id',
      render: (id) => <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{id}</span>
    },
    {
      header: 'Product',
      accessor: 'product',
      render: (name) => <span className="font-semibold text-slate-900 dark:text-slate-100">{name}</span>
    },
    {
      header: 'Qty',
      accessor: 'quantity',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => {
        const styles = {
          'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          'Under Process': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        const Icons = {
          'Completed': <CheckCircle2 className="w-4 h-4" />,
          'Under Process': <Clock className="w-4 h-4 animate-spin-slow" />,
          'Rejected': <XCircle className="w-4 h-4" />
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 w-fit ${styles[status]}`}>
            {Icons[status]}
            {status}
          </span>
        );
      }
    },
    {
      header: 'Timeline',
      accessor: 'startDate',
      render: (start, batch) => (
        <div className="text-xs text-slate-500">
          <div>Start: {start}</div>
          <div>End: {batch.completionDate}</div>
        </div>
      )
    },
    {
      header: 'Photos',
      accessor: 'photos',
      render: (photos, batch) => (
        <button 
          onClick={() => handleOpenUpload(batch)}
          className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span className="text-sm font-medium">{photos.length > 0 ? `${photos.length} Captured` : 'Upload'}</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="standard" className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Production Hub
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Manufacturing queue and quality control
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-indigo-500/25">
              <Plus className="w-5 h-5" />
              New Batch
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <Table 
          columns={columns} 
          data={batches} 
          pagination={true}
          pageSize={5}
        />
      </GlassCard>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => !isUploading && setIsUploadModalOpen(false)}
        title={`Production Photos: ${selectedBatch?.id}`}
      >
        <div className="space-y-6 pt-4">
          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                <span>Uploading to Security Cloud...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Preview Grid */}
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group">
                <img src={src} className="w-full h-full object-cover" alt="Preview" />
                {!isUploading && (
                  <button 
                    onClick={() => setPreviews(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            
            {!isUploading && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-cyan-400 transition-colors group"
                type="button"
              >
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/30 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-cyan-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Add Photo</span>
              </button>
            )}
          </div>

          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />

          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={() => setIsUploadModalOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 bg-gradient-to-r from-cyan-400 to-indigo-500 border-none" 
              onClick={handleUpload}
              disabled={isUploading || previews.length === 0}
            >
              {isUploading ? 'Finalizing...' : 'Submit Batch Photos'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductionPage;
