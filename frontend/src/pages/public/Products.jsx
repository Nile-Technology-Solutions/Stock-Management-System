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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with filters
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 dark:from-cyan-600 dark:via-sky-600 dark:to-blue-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Premium Collection
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Discover Our Products
            </h1>
            <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto leading-relaxed">
              Explore our curated selection of high-quality materials and furniture components
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="mb-10 space-y-6">
          {/* Search Bar and View Mode */}
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
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">View:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${viewMode === 'grid'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-white shadow-md shadow-cyan-400/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${viewMode === 'list'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-white shadow-md shadow-cyan-400/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          )}

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory) && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active filters:</span>
              {searchQuery && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg text-sm border border-cyan-200 dark:border-cyan-800">
                  <span>Search: "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-cyan-900 dark:hover:text-cyan-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-lg text-sm border border-sky-200 dark:border-sky-800">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="hover:text-sky-900 dark:hover:text-sky-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} viewMode={viewMode} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={handleRetry}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description={searchQuery || selectedCategory
              ? "Try adjusting your filters or search query"
              : "No products available at the moment"
            }
            action={
              (searchQuery || selectedCategory) && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  variant="primary"
                >
                  Clear Filters
                </Button>
              )
            }
          />
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                showBadges={true}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-12">
            <div className="bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-900/20 dark:via-sky-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800/50 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Showing{' '}
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent mx-2">
                  {products.length}
                </span>
                {' '}product{products.length !== 1 ? 's' : ''}
                {selectedCategory && (
                  <span>
                    {' '}in{' '}
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">{selectedCategory}</span>
                  </span>
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
