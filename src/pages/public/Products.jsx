import { useState, useEffect } from 'react';
import { stockApi } from '../../services/stockApi';
import { categoryApi } from '../../services/categoryApi';
import ProductCard from '../../components/public/ProductCard';
import ProductCardSkeleton from '../../components/public/ProductCardSkeleton';
import CategoryFilter from '../../components/public/CategoryFilter';
import SearchInput from '../../components/public/SearchInput';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => { fetchData(); }, [selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      const [productsData, categoriesData] = await Promise.all([
        stockApi.getProducts(params),
        categories.length === 0 ? categoryApi.getCategories() : Promise.resolve(categories)
      ]);
      setProducts(productsData);
      if (categories.length === 0) setCategories(categoriesData.map(c => c.name));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => setSelectedCategory(category);
  const handleSearch = (query) => setSearchQuery(query);
  const handleRetry = () => fetchData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-stone-900 to-amber-950 text-white pt-24 pb-20">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
              Custom Woodwork Collection
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Our{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse our handcrafted furniture, custom cabinets, and CNC woodwork pieces — 
            all made to order right here in Addis Ababa.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Filters & Search ── */}
        <div className="mb-10 space-y-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-auto lg:flex-1 max-w-2xl">
              <SearchInput
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by name, type, or material..."
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">View:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-400/30'
                      : 'text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-400/30'
                      : 'text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}

          {/* Active Filters */}
          {(searchQuery || selectedCategory) && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active filters:</span>
              {searchQuery && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-sm border border-amber-200 dark:border-amber-800">
                  <span>Search: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-amber-900 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-sm border border-orange-200 dark:border-orange-800">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('')} className="hover:text-orange-900 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
                className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Product Grid ── */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} viewMode={viewMode} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description={searchQuery || selectedCategory ? 'Try adjusting your filters or search query' : 'No products available at the moment'}
            action={(searchQuery || selectedCategory) && (
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }} variant="primary">
                Clear Filters
              </Button>
            )}
          />
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} showBadges={true} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-12">
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-amber-900/10 rounded-2xl p-6 border border-amber-200/60 dark:border-amber-800/30 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Showing{' '}
                <span className="text-2xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mx-2">
                  {products.length}
                </span>
                {' '}product{products.length !== 1 ? 's' : ''}
                {selectedCategory && (
                  <span> in <span className="font-bold text-amber-600 dark:text-amber-400">{selectedCategory}</span></span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
