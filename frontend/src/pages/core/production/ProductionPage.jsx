import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import {
  Settings, RefreshCw, Plus, Upload,
  Camera, Trash2, AlertCircle
} from '../../../components/icons';
import { productionApi } from '../../../services/productionApi';
import { categoryApi } from '../../../services/categoryApi';
import { stockApi } from '../../../services/stockApi';
import { api } from '../../../services/api';
import { resolveImageUrl } from '../../../utils/imageUrl';

const STATUS_OPTIONS = ['UnderProcess', 'Completed', 'Rejected'];

const emptyForm = {
  categoryId: '',
  title: '',
  status: 'UnderProcess',
  progressPercentage: 0,
  startedDate: new Date().toISOString().split('T')[0],
  submittingDate: '',
  workInstructions: '',
  paymentNote: '',
  orderId: '',
};

const ProductionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState([]); // { previewUrl, file } | string
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [categories, setCategories] = useState([]);
  const [stockMaterials, setStockMaterials] = useState([]);
  const [materialUsages, setMaterialUsages] = useState([]); // [{ stockMaterialId, quantityUsed }]
  const [formPhotos, setFormPhotos] = useState([]); // new File[] attached during creation
  const [formPhotoPreviews, setFormPhotoPreviews] = useState([]); // preview URLs
  const formFileRef = useRef(null);
  const uploadFileRef = useRef(null);

  // ── Fetch supporting data ──
  const fetchSupportingData = useCallback(async () => {
    try {
      const [catData, stockResult] = await Promise.all([
        categoryApi.getCategories(),
        stockApi.getAllStock(),
      ]);
      setCategories(Array.isArray(catData) ? catData : []);
      const rawStock = stockResult?.data?.data || stockResult?.data || [];
      setStockMaterials(Array.isArray(rawStock) ? rawStock : []);
    } catch (err) {
      console.error('Failed to load supporting data:', err);
    }
  }, []);

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
    fetchSupportingData();
  }, [fetchProduction, fetchSupportingData]);

  // ── Auto-open modal if orderId in URL ──
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam && !loading) {
      setSelectedBatch(null);
      setFormData({ ...emptyForm, orderId: orderIdParam });
      setMaterialUsages([]);
      setFormPhotos([]);
      setFormPhotoPreviews([]);
      setFormError('');
      setIsModalOpen(true);
      // Remove the param from URL so refreshing doesn't re-open
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, loading, setSearchParams]);

  // ── Open modal helpers ──
  const handleOpenAddModal = () => {
    setSelectedBatch(null);
    setFormData(emptyForm);
    setMaterialUsages([]);
    setFormPhotos([]);
    setFormPhotoPreviews([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      categoryId: String(batch.categoryId || ''),
      title: batch.title || '',
      status: batch.status || 'UnderProcess',
      progressPercentage: batch.progressPercentage || 0,
      startedDate: batch.startedDate ? batch.startedDate.split('T')[0] : '',
      submittingDate: batch.submittingDate ? batch.submittingDate.split('T')[0] : '',
      workInstructions: batch.workInstructions || '',
      paymentNote: batch.paymentNote || '',
      orderId: batch.orderId ? String(batch.orderId) : '',
    });
    setMaterialUsages((batch.materialUsages || []).map(u => ({
      stockMaterialId: String(u.stockMaterialId),
      quantityUsed: u.quantityUsed,
    })));
    setFormPhotos([]);
    setFormPhotoPreviews([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenUpload = (batch) => {
    setSelectedBatch(batch);
    const photoUrls = (batch.photos || []).map(p =>
      typeof p === 'string' ? resolveImageUrl(p) : resolveImageUrl(p.url)
    );
    setPreviews(photoUrls);
    setIsUploadModalOpen(true);
  };

  // ── Form handlers ──
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progressPercentage' ? parseInt(value) || 0 : value,
    }));
  };

  // ── Stock material row management ──
  const addMaterialRow = () => {
    setMaterialUsages(prev => [...prev, { stockMaterialId: '', quantityUsed: 1 }]);
  };

  const updateMaterialRow = (idx, field, value) => {
    setMaterialUsages(prev => prev.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    ));
  };

  const removeMaterialRow = (idx) => {
    setMaterialUsages(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Photo selection during creation ──
  const handleFormPhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormPhotos(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setFormPhotoPreviews(prev => [...prev, ...urls]);
  };

  const removeFormPhoto = (idx) => {
    setFormPhotos(prev => prev.filter((_, i) => i !== idx));
    setFormPhotoPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Submit (create or update) ──
  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const fd = new FormData();
      fd.append('categoryId', formData.categoryId);
      fd.append('title', formData.title);
      fd.append('status', formData.status);
      fd.append('progressPercentage', formData.progressPercentage);
      if (formData.startedDate) fd.append('startedDate', formData.startedDate);
      if (formData.submittingDate) fd.append('submittingDate', formData.submittingDate);
      if (formData.workInstructions) fd.append('workInstructions', formData.workInstructions);
      if (formData.paymentNote) fd.append('paymentNote', formData.paymentNote);
      if (formData.orderId) fd.append('orderId', formData.orderId);

      // Attach material usages as JSON string (backend parses it)
      const validUsages = materialUsages.filter(u => u.stockMaterialId && u.quantityUsed > 0);
      if (validUsages.length > 0) {
        fd.append('materialUsages', JSON.stringify(validUsages));
      }

      // Attach photos
      formPhotos.forEach(file => fd.append('photos', file));

      if (selectedBatch) {
        await productionApi.updateProduction(selectedBatch.id, fd);
      } else {
        await productionApi.createProduction(fd);
      }

      setIsModalOpen(false);
      fetchProduction(true);
    } catch (error) {
      console.error('Failed to save production record:', error);
      setFormError(error.message || 'Error saving record. Check stock quantities and try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Upload photos to existing production record ──
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map(file => ({ previewUrl: URL.createObjectURL(file), file }));
    setPreviews(prev => [...prev, ...newItems]);
  };

  const handleUploadPhotos = async () => {
    const newFiles = previews.filter(p => p.file instanceof File).map(p => p.file);
    if (newFiles.length === 0) { setIsUploadModalOpen(false); return; }
    setIsUploading(true);
    try {
      const fd = new FormData();
      newFiles.forEach(f => fd.append('photos', f));
      await productionApi.updateProduction(selectedBatch.id, fd);
      setIsUploadModalOpen(false);
      fetchProduction(true);
    } catch (error) {
      console.error('Failed to upload photos:', error);
      alert('Failed to upload photos: ' + (error.message || ''));
    } finally {
      setIsUploading(false);
    }
  };

  // ── Table columns ──
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (id) => <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">#{id}</span>
    },
    {
      header: 'Order',
      accessor: 'orderId',
      render: (orderId) => orderId
        ? <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">Order #{orderId}</span>
        : <span className="text-xs text-slate-400">—</span>
    },
    {
      header: 'Title / Category',
      accessor: 'title',
      render: (title, batch) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{title || 'No Title'}</span>
          <span className="text-[10px] text-slate-500 uppercase">{batch.category?.name || `Category ${batch.categoryId}`}</span>
        </div>
      )
    },
    {
      header: 'Progress',
      accessor: 'progressPercentage',
      render: (pct) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-sky-400" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-medium">{pct}%</span>
        </div>
      )
    },
    {
      header: 'Materials Used',
      accessor: 'materialUsages',
      render: (usages) => (
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
          {(usages || []).length === 0
            ? <span className="text-slate-400">—</span>
            : (usages || []).slice(0, 2).map((u, i) => (
              <div key={i}>{u.stockMaterial?.name || `Material #${u.stockMaterialId}`}: <span className="font-semibold">{u.quantityUsed}</span></div>
            ))}
          {(usages || []).length > 2 && <div className="text-slate-400">+{(usages || []).length - 2} more</div>}
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
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles['UnderProcess']}`}>
            {status}
          </span>
        );
      }
    },
    {
      header: 'Photos',
      accessor: 'photos',
      render: (photos, batch) => (
        <button onClick={() => handleOpenUpload(batch)} className="flex items-center gap-1.5 text-cyan-500 hover:text-cyan-600">
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
      {/* Header */}
      <GlassCard variant="standard" className="border-none shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Production Tracking</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Manage production records and stock material usage</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => fetchProduction(true)}><RefreshCw className="w-4 h-4" /></Button>
            <Button variant="primary" onClick={handleOpenAddModal} className="flex items-center gap-2"><Plus className="w-5 h-5" /> New Record</Button>
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="p-4">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-slate-500 font-bold uppercase tracking-widest">Loading production records...</div>
        ) : (
          <Table columns={columns} data={batches} pagination={true} pageSize={8} />
        )}
      </GlassCard>

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBatch ? `Update Production #${selectedBatch.id}` : 'New Production Record'}
      >
        <form onSubmit={handleSubmitBatch} className="space-y-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">

          {/* Linked Order (read-only if from URL, editable otherwise) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Linked Order (Optional)</label>
            <input
              name="orderId"
              type="number"
              value={formData.orderId}
              onChange={handleInputChange}
              placeholder="Leave blank for non-order production"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm"
            />
            {formData.orderId && (
              <p className="text-xs text-amber-600 dark:text-amber-400">⚡ This production will be linked to Order #{formData.orderId}. When completed, the order status updates automatically.</p>
            )}
          </div>

          {/* Title + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
              <input required name="title" value={formData.title} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
              <select required name="categoryId" value={formData.categoryId} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm">
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Status + Progress */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress ({formData.progressPercentage}%)</label>
              <input type="range" name="progressPercentage" min="0" max="100" value={formData.progressPercentage} onChange={handleInputChange}
                className="w-full accent-cyan-500" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Started Date</label>
              <input name="startedDate" type="date" value={formData.startedDate} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expected Completion</label>
              <input name="submittingDate" type="date" value={formData.submittingDate} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm" />
            </div>
          </div>

          {/* Work Instructions */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Work Instructions</label>
            <textarea name="workInstructions" value={formData.workInstructions} onChange={handleInputChange}
              rows={3}
              placeholder="Describe the production steps, customization details..."
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm" />
          </div>

          {/* ── Stock Materials Section ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Stock Materials Used
              </label>
              <button type="button" onClick={addMaterialRow}
                className="text-xs px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg hover:bg-cyan-100 font-semibold">
                + Add Material
              </button>
            </div>

            {stockMaterials.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">No stock materials available.</p>
            )}

            {materialUsages.length === 0 && stockMaterials.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">No materials added yet. Click "+ Add Material" to select raw materials from stock.</p>
            )}

            {materialUsages.map((row, idx) => {
              const chosen = stockMaterials.find(m => String(m.id) === String(row.stockMaterialId));
              return (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                  <select
                    value={row.stockMaterialId}
                    onChange={e => updateMaterialRow(idx, 'stockMaterialId', e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm"
                  >
                    <option value="">Select material…</option>
                    {stockMaterials.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.color ? m.color + ', ' : ''}{m.size ? 'Size: ' + m.size + ', ' : ''}Qty: {m.quantity})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    max={chosen?.quantity || 9999}
                    value={row.quantityUsed}
                    onChange={e => updateMaterialRow(idx, 'quantityUsed', parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 text-sm text-center"
                  />
                  {chosen && (
                    <span className={`text-xs font-medium ${row.quantityUsed > chosen.quantity ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                      /{chosen.quantity}
                    </span>
                  )}
                  <button type="button" onClick={() => removeMaterialRow(idx)}
                    className="p-1 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {materialUsages.some(r => {
              const m = stockMaterials.find(m => String(m.id) === String(r.stockMaterialId));
              return m && r.quantityUsed > m.quantity;
            }) && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  Some quantities exceed available stock. Reduce them before saving.
                </div>
              )}
          </div>

          {/* ── Initial Photos ── */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Initial / Progress Photos</label>
            <div className="grid grid-cols-4 gap-2">
              {formPhotoPreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFormPhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => formFileRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-400 transition-colors">
                <Upload className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-1">Add</span>
              </button>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" ref={formFileRef} onChange={handleFormPhotoChange} />
          </div>

          {/* Error */}
          {formError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={formLoading}>
              {formLoading ? 'Saving...' : selectedBatch ? 'Update Record' : 'Create Production'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Photo Upload Modal (for existing records) ── */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => !isUploading && setIsUploadModalOpen(false)}
        title={`Update Photos — Production #${selectedBatch?.id || ''}`}
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, idx) => {
              const imgSrc = typeof src === 'string' ? src : src.previewUrl;
              return (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={imgSrc} className="w-full h-full object-cover" alt={`Photo ${idx + 1}`} />
                </div>
              );
            })}
            <button type="button" onClick={() => uploadFileRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-400 transition-colors">
              <Upload className="w-6 h-6" /><span className="text-[10px] font-bold mt-2">Add Photos</span>
            </button>
          </div>
          <input type="file" multiple accept="image/*" className="hidden" ref={uploadFileRef} onChange={handleFileChange} />

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsUploadModalOpen(false)} disabled={isUploading}>Cancel</Button>
            <Button variant="primary" className="flex-1 flex items-center justify-center gap-2" onClick={handleUploadPhotos} disabled={isUploading}>
              {isUploading ? <>Uploading...</> : <><Camera className="w-4 h-4" /> Save Photos</>}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductionPage;
