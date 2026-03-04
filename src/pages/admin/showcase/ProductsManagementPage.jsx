import { useState, useEffect, useCallback } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import ImageUpload from '../../../components/common/ImageUpload';
import { Package, RefreshCw, Plus, Search, Filter, Edit3, Trash2, Star, Eye } from '../../../components/icons';
import { productApi } from '../../../services/productApi';

const CATEGORIES = [
  { label: 'Furniture', value: 1 },
  { label: 'Cabinets', value: 2 },
  { label: 'Tables', value: 3 },
  { label: 'Chairs', value: 4 },
];

const emptyForm = {
  name: '',
  categoryId: '1',
  color: '',
  stockQuantity: '0',
  price: '',
  description: '',
  featured: false,
  images: [],
};

const ProductsManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const data = await productApi.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAddModal = () => {
    setCurrentProduct(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name || '',
      categoryId: String(product.categoryId || '1'),
      color: product.color || '',
      stockQuantity: String(product.stockQuantity ?? ''),
      price: String(product.price ?? ''),
      description: product.description || '',
      featured: product.featured === true,
      images: product.photos || [],
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      images: images
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        alert('Product name is required');
        setFormLoading(false);
        return;
      }

      if (!formData.color || !formData.color.trim()) {
        alert('Color is required');
        setFormLoading(false);
        return;
      }

      const productData = {
        name: formData.name.trim(),
        categoryId: parseInt(formData.categoryId),
        color: formData.color.trim(),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        featured: formData.featured || false,
      };

      // Add optional fields only if they have values
      if (formData.price && formData.price.trim() !== '') {
        const priceValue = parseFloat(formData.price);
        if (priceValue > 0) {
          productData.price = priceValue;
        }
      }
      
      if (formData.description && formData.description.trim() !== '') {
        productData.description = formData.description.trim();
      }

      console.log('Sending product data:', productData);

      // TODO: When backend supports image upload, send formData.images
      // For now, images are stored temporarily

      let response;
      if (currentProduct) {
        response = await productApi.updateProduct(currentProduct.id, productData);
      } else {
        response = await productApi.createProduct(productData);
      }

      console.log('Product saved successfully:', response);
      setIsModalOpen(false);
      fetchProducts(true);
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Show detailed error message
      let errorMessage = 'Failed to save product.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await productApi.deleteProduct(currentProduct.id);
      setIsDeleteModalOpen(false);
      fetchProducts(true);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setFormLoading(false);
    }
  };

  const getCategoryLabel = (product) => {
    if (product.category?.name) return product.category.name;
    const cat = CATEGORIES.find(c => c.value === product.categoryId);
    return cat?.label || '—';
  };

  const filteredProducts = products.filter(product => {
    const catLabel = getCategoryLabel(product);
    const matchesSearch =
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || catLabel === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (value, product) => {
        const hasImages = product.photos && product.photos.length > 0;
        const imageUrl = hasImages ? product.photos[0].url : null;
        
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={value} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-6 h-6 text-cyan-500" />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {value}
                {product.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
              </div>
              <div className="text-xs text-slate-500">{getCategoryLabel(product)}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (price) => (
        <span className="font-bold text-slate-700 dark:text-slate-300">
          {price ? `ETB ${Number(price).toLocaleString()}` : 'N/A'}
        </span>
      )
    },
    {
      header: 'Stock',
      accessor: 'stockQuantity',
      render: (qty) => {
        const numQty = Number(qty ?? 0);
        return (
          <span className={`font-bold ${numQty === 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
            {numQty}
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'featured',
      render: (featured, product) => (
        <div className="flex flex-col gap-1">
          {featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 w-fit">
              Featured
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 w-fit">
              Out of Stock
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, product) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenEditModal(product)} className="p-2 text-slate-400 hover:text-cyan-500 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenDeleteModal(product)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="standard" className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Products Management
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Manage finished products for public catalog
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="glass-secondary" onClick={() => fetchProducts(true)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" onClick={handleOpenAddModal} className="flex items-center gap-2 shadow-lg shadow-purple-500/25">
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-xs text-slate-500">Total Products</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{products.filter(p => p.featured).length}</div>
            <div className="text-xs text-slate-500">Featured</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{products.filter(p => p.stockQuantity === 0).length}</div>
            <div className="text-xs text-slate-500">Out of Stock</div>
          </div>
        </GlassCard>
      </div>

      {/* Table */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.label}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest">Loading Products...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredProducts} pagination={true} pageSize={10} />
        )}
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Update Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="name"
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Custom Dining Table"
            />
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select
                name="categoryId"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="color"
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="e.g. Natural Oak"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price (ETB)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="15000.00"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="stockQuantity"
                type="number"
                min="0"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              name="description"
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed product description..."
            />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 py-1">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              className="w-4 h-4 accent-purple-500 rounded"
              checked={formData.featured}
              onChange={handleInputChange}
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Mark as Featured Product
            </label>
          </div>

          {/* Image Upload */}
          <ImageUpload
            images={formData.images}
            onChange={handleImagesChange}
            maxImages={5}
            label="Product Images"
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={formLoading}>
              {formLoading ? 'Saving...' : currentProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
      >
        <div className="pt-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to delete <strong>{currentProduct?.name}</strong>? This will remove it from the public catalog.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600 border-red-500 shadow-lg shadow-red-500/20"
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? 'Deleting...' : 'Delete Product'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsManagementPage;
