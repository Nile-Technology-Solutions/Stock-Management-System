import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stockApi } from '../../services/stockApi';
import { orderApi } from '../../services/orderApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const OrderPlacement = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    quantity: 1,
    paymentMethod: 'Chapa', // Default payment method
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockApi.getProductById(productId);
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
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.customerName.trim()) {
      errors.customerName = 'Full name is required';
    }

    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errors.customerEmail = 'Please enter a valid email';
    }

    if (!formData.customerPhone.trim()) {
      errors.customerPhone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.customerPhone)) {
      errors.customerPhone = 'Please enter a valid phone number';
    }

    if (!formData.deliveryAddress.trim()) {
      errors.deliveryAddress = 'Delivery address is required';
    }

    if (formData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        productId: productId,
        quantity: parseInt(formData.quantity),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod,
      };

      // Call API to create order
      const response = await orderApi.createOrder(orderData);

      // Response should contain orderId and paymentUrl
      if (response && response.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = response.paymentUrl;
      } else if (response && response.orderId) {
        // If no payment URL, navigate to success page
        navigate(`/payment/success?orderId=${response.orderId}`);
      } else {
        throw new Error('Invalid response from order service');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Place Your Order
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Fill in your details to complete the order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Customer Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.customerName
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.customerName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.customerName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.customerEmail
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200`}
                    placeholder="your.email@example.com"
                  />
                  {formErrors.customerEmail && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.customerEmail}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.customerPhone
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200`}
                    placeholder="+251 912 345 678"
                  />
                  {formErrors.customerPhone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.customerPhone}</p>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.deliveryAddress
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your complete delivery address"
                  />
                  {formErrors.deliveryAddress && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.deliveryAddress}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.quantity
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-slate-300 dark:border-slate-600'
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200`}
                  />
                  {formErrors.quantity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.quantity}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Chapa' }))}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.paymentMethod === 'Chapa'
                          ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-cyan-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Chapa</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Online Payment</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Telebirr' }))}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.paymentMethod === 'Telebirr'
                          ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-cyan-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Telebirr</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Mobile Payment</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    loading={submitting}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-500 hover:to-sky-500 shadow-lg shadow-cyan-400/30"
                  >
                    {submitting ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="large"
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Order Summary
              </h2>

              {product && (
                <div className="space-y-4">
                  {/* Product Image */}
                  {product.image && (
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  {/* Product Name */}
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {product.category}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Quantity</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Payment Method</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{formData.paymentMethod}</span>
                    </div>
                  </div>

                  {product.price && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total</span>
                        <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                          {product.price}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacement;
