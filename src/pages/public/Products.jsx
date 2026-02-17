import { useState, useEffect } from 'react';
import { stockApi } from '../../../frontend/src/services/stockApi';
import ProductCard from '../../../frontend/src/components/public/ProductCard';
import ProductCardSkeleton from '../../../frontend/src/components/public/ProductCardSkeleton';
import CategoryFilter from '../../../frontend/src/components/public/CategoryFilter';
import SearchInput from '../../../frontend/src/components/public/SearchInput';
import EmptyState from '../../../frontend/src/components/common/EmptyState';
import ErrorState from '../../../frontend/src/components/common/ErrorState';
import Button from '../../../frontend/src/components/common/Button';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
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
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const [productsData, categoriesData] = await Promise.all([
        stockApi.getProducts(params),
        categories.length === 0 ? stockApi.getCategories() : Promise.resolve(categories)
      ]);

      setProducts(productsData);
      if (categories.length === 0) setCategories(categoriesData);
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
      <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 dark:from-cyan-600 dark:via-sky-600 dark:to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto">
              Discover our premium collection of quality products
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchInput
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products..."
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-cyan-400 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-cyan-400 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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
            description={searchQuery || selectedCategory !== 'all' 
              ? "Try adjusting your filters or search query"
              : "No products available at the moment"
            }
            action={
              (searchQuery || selectedCategory !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
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
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{products.length}</span> product{products.length !== 1 ? 's' : ''}
              {selectedCategory !== 'all' && (
                <span> in <span className="font-semibold text-cyan-600 dark:text-cyan-400">{selectedCategory}</span></span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
