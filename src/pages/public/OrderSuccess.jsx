import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Phone, Mail } from '../../components/icons';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If no order data, redirect to home
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            No Order Information
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Unable to find order details. Please check your order history.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Thank you for your order. We'll contact you shortly to confirm the details.
          </p>
        </div>

        {/* Order Details */}
        <GlassCard className="mb-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Order Details
              </h2>
              <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                {order.id}
              </span>
            </div>

            {/* Product Information */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {order.product.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {order.product.category}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Quantity: <span className="font-semibold text-slate-900 dark:text-slate-100">{order.quantity}</span>
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Price: <span className="font-semibold text-slate-900 dark:text-slate-100">{order.product.price}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {order.totalPrice}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Customer Information */}
        <GlassCard className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Delivery Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Customer Name</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {order.customer.fullName}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Phone Number</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {order.customer.phoneNumber}
                </p>
              </div>
            </div>

            {order.customer.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Email Address</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {order.customer.email}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Delivery Location</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {order.customer.deliveryLocation}
                </p>
              </div>
            </div>

            {order.customer.additionalNotes && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Additional Notes</p>
                <p className="text-slate-900 dark:text-slate-100">
                  {order.customer.additionalNotes}
                </p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            What's Next?
          </h2>
          <ol className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <span>Our team will review your order and contact you within 24 hours</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <span>We'll confirm the delivery details and payment method</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <span>Your order will be prepared and delivered to your location</span>
            </li>
          </ol>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/products')}
            size="large"
          >
            Continue Shopping
          </Button>
          <Button
            variant="glass-secondary"
            onClick={() => navigate('/')}
            size="large"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
