import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { stockApi } from '../../services/stockApi';
import ProductImageGallery from '../../components/public/ProductImageGallery';
import ProductSpecs from '../../components/public/ProductSpecs';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockApi.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = () => {
    navigate(`/order/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader size="large" text="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <ErrorState message={error} onRetry={fetchProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Product not found
          </h2>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-sky-50/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">{product.name}</span>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            <ProductImageGallery images={product.images || [product.image]} />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block px-4 py-2 text-sm font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30 rounded-full border border-cyan-200 dark:border-cyan-800">
                {product.category}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {product.rating} out of 5
                </span>
              </div>
            )}

            {/* Price */}
            {product.price && (
              <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Price</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  {product.price}
                </p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Description
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Specifications
                </h2>
                <ProductSpecs specs={product.specifications} />
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleOrderNow}
                variant="primary"
                size="large"
                className="flex-1 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-500 hover:to-sky-500 shadow-lg shadow-cyan-400/30"
              >
                Order Now
              </Button>
              <Button
                onClick={() => navigate('/products')}
                variant="secondary"
                size="large"
                className="flex-1"
              >
                Browse More Products
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Fast Processing</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
