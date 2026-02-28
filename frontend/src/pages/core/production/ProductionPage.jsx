import { useState, useEffect, useCallback, useRef } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import {
  Settings, Activity, RefreshCw, Plus, Image as ImageIcon,
  Upload, CheckCircle2, XCircle, Clock, Camera, FileText, DollarSign
} from '../../../components/icons';
import { productionApi } from '../../../services/productionApi';

/**
 * ProductionPage - Refined for Swagger v1.4.0
 * Schema: ProductionRecord
 * Enums: UnderProcess, Completed, Rejected
 */

const STATUS_OPTIONS = ['UnderProcess', 'Completed', 'Rejected'];

const emptyForm = {
  categoryId: '',
  title: '',
  status: 'UnderProcess',
  progressPercentage: 0,
  startedDate: '',
  submittingDate: '',
  workInstructions: '',
  paymentNote: '',
};

const ProductionPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProduction = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const data = await productionApi.getProductionRecords();
      setBatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch production records:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduction();
  }, [fetchProduction]);

  const handleOpenAddModal = () => {
    setSelectedBatch(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      categoryId: String(batch.categoryId || ''),
      title: batch.title || '',
      status: batch.status || 'UnderProcess',
      progressPercentage: batch.progressPercentage || 0,
      startedDate: batch.startedDate || '',
      submittingDate: batch.submittingDate || '',
      workInstructions: batch.workInstructions || '',
      paymentNote: batch.paymentNote || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenUpload = (batch) => {
    setSelectedBatch(batch);
    const photoUrls = (batch.photos || []).map(p => typeof p === 'string' ? p : p.url);
    setPreviews(photoUrls);
    setUploadProgress(0);
    setIsUploadModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progressPercentage' || name === 'categoryId' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (selectedBatch) {
        await productionApi.updateProduction(selectedBatch.id, formData);
      } else {
        await productionApi.createProduction(formData);
      }
      setIsModalOpen(false);
      fetchProduction(true);
    } catch (error) {
      console.error('Failed to save production record:', error);
      alert('Error saving record');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleUploadPhotos = async () => {
    if (previews.length === 0) return;
    setIsUploading(true);
    try {
      for (let i = 0; i <= 100; i += 25) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 100));
      }
      const photoObjects = previews.map((url, idx) => ({
        id: Date.now() + idx,
        url: url,
        description: `Production photo ${idx + 1}`
      }));
      const updatedBatch = { ...selectedBatch, photos: photoObjects };
      await productionApi.updateProduction(selectedBatch.id, updatedBatch);
      setIsUploadModalOpen(false);
      fetchProduction(true);
    } catch (error) {
      console.error('Failed to upload photos:', error);
      alert('Failed to update photos');
    } finally {
      setIsUploading(false);
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (id) => <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">#{id}</span>
    },
    {
      header: 'Title / Category',
      accessor: 'title',
      render: (title, batch) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{title || 'No Title'}</span>
          <span className="text-[10px] text-slate-500 uppercase">Category {batch.categoryId}</span>
        </div>
      )
    },
    {
      header: 'Progress',
      accessor: 'progressPercentage',
      render: (pct) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-medium">{pct}%</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => {
        const styles = {
          'UnderProcess': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${styles[status] || styles['UnderProcess']}`}>
            {status}
          </span>
        );
      }
    },
    {
      header: 'Timeline',
      accessor: 'startedDate',
      render: (start, batch) => (
        <div className="text-[10px] text-slate-500">
          <div>Started: {start || '—'}</div>
          <div>Submit: {batch.submittingDate || '—'}</div>
        </div>
      )
    },
    {
      header: 'Photos',
      accessor: 'photos',
      render: (photos, batch) => (
        <button onClick={() => handleOpenUpload(batch)} className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600">
          <Camera className="w-4 h-4" />
          <span className="text-xs font-medium">{(photos || []).length}</span>
        </button>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, batch) => (
        <Button variant="ghost" size="small" onClick={() => handleOpenEditModal(batch)}>Edit</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <GlassCard variant="standard" className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Production Tracking
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Refined v1.4.0 Alignment</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => fetchProduction(true)}><RefreshCw className="w-4 h-4" /></Button>
            <Button variant="primary" onClick={handleOpenAddModal} className="flex items-center gap-2"><Plus className="w-5 h-5" /> New Record</Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-slate-500 font-bold uppercase tracking-widest">Initialising Factory Floor...</div>
        ) : (
          <Table columns={columns} data={batches} pagination={true} pageSize={5} />
        )}
      </GlassCard>

      {/* Batch Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedBatch ? 'Update Production' : 'New Production Record'}>
        <form onSubmit={handleSubmitBatch} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title *</label>
              <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category ID *</label>
              <input required name="categoryId" type="number" value={formData.categoryId} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Progress (%) *</label>
              <input required name="progressPercentage" type="number" min="0" max="100" value={formData.progressPercentage} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Started Date</label>
              <input name="startedDate" type="date" value={formData.startedDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Submitting Date</label>
              <input name="submittingDate" type="date" value={formData.submittingDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Work Instructions</label>
            <textarea name="workInstructions" value={formData.workInstructions} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 min-h-[80px]" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Payment Note</label>
            <input name="paymentNote" value={formData.paymentNote} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={formLoading}>{formLoading ? 'Saving...' : 'Save Record'}</Button>
          </div>
        </form>
      </Modal>

      {/* Upload Modal - same as before but keeping it simple */}
      <Modal isOpen={isUploadModalOpen} onClose={() => !isUploading && setIsUploadModalOpen(false)} title="Upload Progress Photos">
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden"><img src={src} className="w-full h-full object-cover" alt="" /></div>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500">
              <Upload className="w-6 h-6" /><span className="text-[10px] font-bold mt-2">Add</span>
            </button>
          </div>
          <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={handleUploadPhotos} disabled={isUploading || previews.length === 0}>{isUploading ? 'Uploading...' : 'Upload'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductionPage;
