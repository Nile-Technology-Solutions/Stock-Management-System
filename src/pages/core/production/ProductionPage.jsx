import { useState, useEffect, useCallback, useRef } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import {
  Settings, Activity, RefreshCw, Plus, Image as ImageIcon,
  Upload, CheckCircle2, XCircle, Clock, Camera
} from '../../../components/icons';
import { productionApi } from '../../../services/productionApi';

// Swagger ProductionRecord schema:
// id, batchNumber (required), productId (required), quantity (required),
// status (required: Planned|In Progress|Completed|Delayed|Rejected),
// startDate, completionDate, photos (Array of Photo objects)

const STATUS_OPTIONS = ['Planned', 'In Progress', 'Completed', 'Delayed', 'Rejected'];

const emptyForm = {
  batchNumber: '',
  productId: '',
  quantity: '',
  status: 'Planned',
  startDate: '',
  completionDate: '',
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
      batchNumber: batch.batchNumber || '',
      productId: String(batch.productId || ''),
      quantity: String(batch.quantity || ''),
      status: batch.status || 'Planned',
      startDate: batch.startDate || '',
      completionDate: batch.completionDate || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenUpload = (batch) => {
    setSelectedBatch(batch);
    // Transform Photo objects {id, url, description} to just URLs for previews
    const photoUrls = (batch.photos || []).map(p => typeof p === 'string' ? p : p.url);
    setPreviews(photoUrls);
    setUploadProgress(0);
    setIsUploadModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
      };

      if (selectedBatch) {
        await productionApi.updateProduction(selectedBatch.id, payload);
      } else {
        await productionApi.createProduction(payload);
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
    // In a real app, these would be uploaded to get URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleUploadPhotos = async () => {
    if (previews.length === 0) return;
    setIsUploading(true);

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 25) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 100));
      }

      // Prepare photos as Photo objects
      const photoObjects = previews.map((url, idx) => ({
        id: Date.now() + idx,
        url: url,
        description: `Production photo ${idx + 1}`
      }));

      const updatedBatch = {
        ...selectedBatch,
        photos: photoObjects
      };

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
      header: 'Batch #',
      accessor: 'batchNumber',
      render: (num, batch) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{num || batch.id}</span>
          <span className="text-[10px] text-slate-500">ID: {batch.id}</span>
        </div>
      )
    },
    {
      header: 'Product ID',
      accessor: 'productId',
      render: (id) => <span className="font-semibold text-slate-900 dark:text-slate-100">Item #{id}</span>
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
          'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          'Planned': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
          'Delayed': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${styles[status] || styles['Planned']}`}>
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
          <div>Start: {start || '—'}</div>
          <div>End: {batch.completionDate || '—'}</div>
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
          <span className="text-sm font-medium">{(photos || []).length} Captured</span>
        </button>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, batch) => (
        <Button variant="ghost" size="small" onClick={() => handleOpenEditModal(batch)}>
          Edit
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
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
            <Button variant="glass-secondary" onClick={() => fetchProduction(true)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" onClick={handleOpenAddModal} className="flex items-center gap-2 shadow-lg shadow-indigo-500/25">
              <Plus className="w-5 h-5" />
              New Batch
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest">Syncing Factory Floor...</p>
          </div>
        ) : (
          <Table columns={columns} data={batches} pagination={true} pageSize={5} />
        )}
      </GlassCard>

      {/* Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBatch ? 'Edit Batch' : 'Start New Batch'}
      >
        <form onSubmit={handleSubmitBatch} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Batch Number *</label>
              <input
                required name="batchNumber" value={formData.batchNumber} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" placeholder="BT-101"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Product ID *</label>
              <input
                required name="productId" type="number" value={formData.productId} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900" placeholder="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Quantity *</label>
              <input
                required name="quantity" type="number" value={formData.quantity} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status *</label>
              <select
                name="status" value={formData.status} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Start Date</label>
              <input
                name="startDate" type="date" value={formData.startDate} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Completion Date</label>
              <input
                name="completionDate" type="date" value={formData.completionDate} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Records'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => !isUploading && setIsUploadModalOpen(false)}
        title={`Batch Photos: ${selectedBatch?.batchNumber || selectedBatch?.id}`}
      >
        <div className="space-y-6 pt-4">
          {isUploading && (
            <div className="space-y-2">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group">
                <img src={src} className="w-full h-full object-cover" alt="Preview" />
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500"
            >
              <Upload className="w-6 h-6" />
              <span className="text-[10px] font-bold mt-2">Add</span>
            </button>
          </div>
          <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={handleUploadPhotos} disabled={isUploading || previews.length === 0}>
              {isUploading ? 'Uploading...' : 'Upload Photos'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductionPage;
