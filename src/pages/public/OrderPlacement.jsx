import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { orderApi } from '../../services/orderApi';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import GlassCard from '../../components/common/GlassCard';
import OrderSuccessModal from '../../components/order/OrderSuccessModal';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [isCustomOrder, setIsCustomOrder] = useState(false);

  const [formData, setFormData] = useState({
    quantity: 1,
    deliveryAddressId: '', // Should be an integer link to an Address
    paymentMethod: 'Chapa',
    customNotes: '',
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

      const totalPrice = product.price ? parseFloat(product.price) * parseInt(formData.quantity) : null;

      const orderData = {
        productName: product.name,
        quantity: parseInt(formData.quantity),
        customNotes: formData.customNotes || '',
        totalPrice,
      };

      // Ready-made order: include productId so backend deducts finished product stock
      // Custom order: no productId, backend sets isCustom = true and calculates deposit
      if (!isCustomOrder) {
        orderData.productId = parseInt(productId);
      }

      // Only include deliveryAddressId if it has a value
      if (formData.deliveryAddressId && formData.deliveryAddressId !== '') {
        orderData.deliveryAddressId = parseInt(formData.deliveryAddressId);
      }

      console.log('Sending order data:', orderData);
      const response = await orderApi.createOrder(orderData);
      console.log('Order response:', response);

      // Backend returns { data: order, message: '...' }
      const order = response.data || response;
      const orderId = order.id;

      if (!orderId) {
        throw new Error('Invalid response from order service - no order ID received');
      }

      // Store the response and show success modal
      setOrderResponse(response);
      setShowSuccessModal(true);
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
                {/* Customization Toggle */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium">Want Customization?</label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {isCustomOrder
                          ? 'You will pay 50% deposit upfront. Remaining after production completes.'
                          : 'Ready-made: Pay full price for immediate delivery.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCustomOrder(!isCustomOrder)}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${isCustomOrder ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${isCustomOrder ? 'translate-x-7' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Custom Notes — always shown for custom, optional for ready-made */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isCustomOrder ? 'Customization Details *' : 'Notes (Optional)'}
                  </label>
                  <textarea
                    name="customNotes" value={formData.customNotes} onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 min-h-[100px] focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    placeholder={isCustomOrder ? 'Describe your customization requirements (color, size, material preferences...)' : 'E.g. Special delivery instructions...'}
                    required={isCustomOrder}
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
                    <img src={resolveImageUrl(product.photos[0].url)} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-slate-500">Unit Price: ETB {product.price ? Number(product.price).toLocaleString() : 'Contact for price'}</p>
                    {!isCustomOrder && (
                      <p className="text-xs text-green-600 font-medium mt-1">{product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}</p>
                    )}
                  </div>

                  {isCustomOrder && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Custom Order</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">You pay 50% deposit now. Remaining 50% after production is complete.</p>
                    </div>
                  )}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{product.price ? `ETB ${(parseInt(product.price) * formData.quantity).toLocaleString()}` : '—'}</span>
                    </div>
                    {isCustomOrder && product.price && (
                      <>
                        <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                          <span>Deposit (50%)</span>
                          <span>ETB {(parseInt(product.price) * formData.quantity * 0.5).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>Remaining</span>
                          <span>ETB {(parseInt(product.price) * formData.quantity * 0.5).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>{isCustomOrder ? 'Due Now' : 'Total'}</span>
                      <span className="text-cyan-600">
                        {product.price
                          ? `ETB ${(parseInt(product.price) * formData.quantity * (isCustomOrder ? 0.5 : 1)).toLocaleString()}`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={orderResponse}
      />
    </div>
  );
};

export default OrderPlacement;
