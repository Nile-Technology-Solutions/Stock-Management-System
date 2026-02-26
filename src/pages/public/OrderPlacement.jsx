import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { orderApi } from '../../services/orderApi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

// Swagger Order schema:
// id, userId (required), productName (required), quantity (required),
// deliveryAddressId (integer), status (enum), totalAmount, createdAt

const OrderPlacement = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    quantity: 1,
    deliveryAddressId: '', // Should be an integer link to an Address
    paymentMethod: 'Chapa',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch product details to get its name for the order
      const data = await productApi.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (formData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to place an order');
      navigate('/login');
      return;
    }

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Map to Swagger Order schema
      const orderData = {
        userId: user.id || user.userId, // Required by spec
        productName: product.name,      // Required by spec
        quantity: parseInt(formData.quantity),
        deliveryAddressId: formData.deliveryAddressId ? parseInt(formData.deliveryAddressId) : null,
        paymentMethod: formData.paymentMethod,
      };

      const response = await orderApi.createOrder(orderData);

      if (response && response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else if (response && (response.orderId || response.id)) {
        navigate(`/payment/success?orderId=${response.orderId || response.id}`);
      } else {
        throw new Error('Invalid response from order service');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader size="large" text="Loading product..." />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <ErrorState message={error} onRetry={fetchProduct} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-sky-50/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Place Your Order</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Authenticated order as {user?.fullName || 'Guest'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Order Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <input
                    type="number" name="quantity" min="1" value={formData.quantity} onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address ID (Optional)</label>
                  <input
                    type="number" name="deliveryAddressId" value={formData.deliveryAddressId} onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border dark:bg-slate-900"
                    placeholder="Enter saved address ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Payment Method</label>
                  <div className="flex gap-4">
                    {['Chapa', 'Telebirr'].map(m => (
                      <button
                        key={m} type="button" onClick={() => setFormData(p => ({ ...p, paymentMethod: m }))}
                        className={`px-6 py-3 rounded-lg border-2 transition-all ${formData.paymentMethod === m ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' : 'border-slate-200 dark:border-slate-700'
                          }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="primary" size="large" loading={submitting} disabled={submitting} className="flex-1">
                    {submitting ? 'Processing...' : 'Place Order'}
                  </Button>
                  <Button type="button" variant="secondary" size="large" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
              </form>
            </GlassCard>
          </div>

          <div className="lg:col-span-1">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              {product && (
                <div className="space-y-4">
                  {product.photos?.[0] && (
                    <img src={product.photos[0].url} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-slate-500">Price: {product.price || 'Contact for price'}</p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-cyan-600">{product.price ? `${parseInt(product.price) * formData.quantity} ETB` : '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacement;
