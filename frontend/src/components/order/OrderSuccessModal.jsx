import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Download,
  X,
  Package,
  Calendar,
  MapPin,
  User,
  Phone,
  Hash,
  FileText,
  Sparkles,
  ArrowRight,
  CreditCard
} from '../icons';
import Button from '../common/Button';
import { paymentApi } from '../../services/paymentApi';

const OrderSuccessModal = ({ isOpen, onClose, orderData }) => {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [payingNow, setPayingNow] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationComplete(false);
      const timer = setTimeout(() => setAnimationComplete(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Early return after all hooks
  if (!isOpen || !orderData) return null;

  const order = orderData.data || orderData;
  const user = order.user || {};
  const deliveryAddress = order.deliveryAddress || {};
  const product = order.product || {};

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Download order receipt as PDF
  const handleDownload = () => {
    setDownloading(true);

    const receiptHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Receipt #${order.id}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            color: #1e293b;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%);
            padding: 40px;
            text-align: center;
            color: white;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p {
            font-size: 18px;
            opacity: 0.95;
        }
        .success-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(255,255,255,0.2);
            padding: 12px 24px;
            border-radius: 50px;
            margin-top: 20px;
            font-size: 16px;
            font-weight: 600;
        }
        .content {
            padding: 40px;
        }
        .section {
            margin-bottom: 30px;
            padding: 25px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid #22d3ee;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .info-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .info-value {
            font-size: 16px;
            color: #0f172a;
            font-weight: 500;
        }
        .order-id {
            font-size: 28px;
            font-weight: 700;
            color: #0ea5e9;
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
            border-radius: 12px;
            margin-bottom: 30px;
            letter-spacing: 2px;
        }
        .footer {
            background: #0f172a;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        .footer p {
            margin-bottom: 10px;
            opacity: 0.8;
        }
        .footer strong {
            color: #22d3ee;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            background: #dcfce7;
            color: #166534;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        @media print {
            body { 
                background: white; 
                padding: 0; 
            }
            .container { 
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order</p>
            <div class="success-badge">
                ✓ Successfully Placed
            </div>
        </div>
        
        <div class="content">
            <div class="order-id">
                ORDER #${order.id}
            </div>

            <div class="section">
                <div class="section-title">📦 Order Details</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Product Name</span>
                        <span class="info-value">${order.productName || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Quantity</span>
                        <span class="info-value">${order.quantity || 0}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Total Price</span>
                        <span class="info-value">${order.totalPrice ? order.totalPrice + ' ETB' : 'Contact for price'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="status-badge">${order.status || 'OrderSubmitted'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Order Date</span>
                        <span class="info-value">${formatDate(order.createdAt)}</span>
                    </div>
                </div>
                ${order.customNotes ? `
                <div class="info-item" style="margin-top: 15px;">
                    <span class="info-label">Custom Notes</span>
                    <span class="info-value">${order.customNotes}</span>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <div class="section-title">👤 Customer Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Full Name</span>
                        <span class="info-value">${user.fullName || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Username</span>
                        <span class="info-value">${user.username || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Customer ID</span>
                        <span class="info-value">#${user.id || 'N/A'}</span>
                    </div>
                </div>
            </div>

            ${deliveryAddress.street ? `
            <div class="section">
                <div class="section-title">📍 Delivery Address</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Street</span>
                        <span class="info-value">${deliveryAddress.street}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">City</span>
                        <span class="info-value">${deliveryAddress.city}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Country</span>
                        <span class="info-value">${deliveryAddress.country || 'Ethiopia'}</span>
                    </div>
                    ${deliveryAddress.zipCode ? `
                    <div class="info-item">
                        <span class="info-label">Zip Code</span>
                        <span class="info-value">${deliveryAddress.zipCode}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}

            ${product.name ? `
            <div class="section">
                <div class="section-title">🛋️ Product Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Product Name</span>
                        <span class="info-value">${product.name}</span>
                    </div>
                    ${product.color ? `
                    <div class="info-item">
                        <span class="info-label">Color</span>
                        <span class="info-value">${product.color}</span>
                    </div>
                    ` : ''}
                    ${product.price ? `
                    <div class="info-item">
                        <span class="info-label">Unit Price</span>
                        <span class="info-value">${product.price} ETB</span>
                    </div>
                    ` : ''}
                    ${product.description ? `
                    <div class="info-item">
                        <span class="info-label">Description</span>
                        <span class="info-value">${product.description}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p><strong>AddHomes Creative Woodworks</strong></p>
            <p>For inquiries, please contact our support team</p>
            <p style="margin-top: 15px; font-size: 12px;">
                Generated on ${new Date().toLocaleString()}
            </p>
        </div>
    </div>
    <script>
        // Auto-print when opened
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
    `;

    // Create a new window with the receipt
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    // Wait a bit for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      setDownloading(false);
    }, 500);
  };

  const handlePayNow = async () => {
    setPayingNow(true);
    setPayError('');
    try {
      const response = await paymentApi.initiatePayment({ orderId: order.id });
      const checkoutUrl = response.data?.checkoutUrl || response.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error('No checkout URL received from payment gateway');
      }
      // Redirect to Chapa
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setPayError(err.message || 'Failed to initiate payment. Please try again.');
      setPayingNow(false);
    }
  };

  const handleTrackOrder = () => {
    navigate(`/order-tracking?orderId=${order.id}`);
    onClose();
  };

  const handleContinueShopping = () => {
    navigate('/products');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Success Header */}
        <div className="relative bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500 p-12 text-center overflow-hidden">
          {/* Animated circles */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-ping" />
            <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="relative z-10">
            {/* Success icon with animation */}
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg transform transition-all duration-500 ${animationComplete ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>

            <h2 className="text-4xl font-bold text-white mb-3">Order Confirmed!</h2>
            <p className="text-white/90 text-lg mb-4">Your order has been successfully placed</p>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold">
              <Sparkles className="w-5 h-5" />
              <span>Order #{order.id}</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8 space-y-6">
          {/* Order ID Card */}
          <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 p-6 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hash className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Order ID</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">#{order.id}</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                {order.status || 'OrderSubmitted'}
              </div>
            </div>
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Info */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Product</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{order.productName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quantity: {order.quantity}</p>
            </div>

            {/* Price Info */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Total Price</h3>
              </div>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {order.totalPrice ? `${order.totalPrice} ETB` : 'Contact for price'}
              </p>
            </div>

            {/* Customer Info */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Customer</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{user.fullName || 'N/A'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">@{user.username || 'N/A'}</p>
            </div>

            {/* Date Info */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Order Date</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryAddress.street && (
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Delivery Address</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                {deliveryAddress.street}, {deliveryAddress.city}
                {deliveryAddress.state && `, ${deliveryAddress.state}`}
                {deliveryAddress.zipCode && ` - ${deliveryAddress.zipCode}`}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{deliveryAddress.country || 'Ethiopia'}</p>
            </div>
          )}

          {/* Custom Notes */}
          {order.customNotes && (
            <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Custom Notes</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{order.customNotes}</p>
            </div>
          )}

          {/* Pay Now Button — Primary CTA */}
          {order.totalPrice && order.status === 'OrderSubmitted' && (
            <div className="pt-2">
              {payError && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-300">{payError}</p>
                </div>
              )}
              <Button
                onClick={handlePayNow}
                disabled={payingNow}
                className="w-full group"
                variant="primary"
                size="large"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {payingNow ? 'Connecting to Chapa...' : `Pay Now — ${order.totalPrice} ETB`}
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 group"
              variant="primary"
              size="large"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              {downloading ? 'Opening Print Dialog...' : 'Download as PDF'}
            </Button>

            <Button
              onClick={handleTrackOrder}
              className="flex-1"
              variant="secondary"
              size="large"
            >
              Track Order
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <Button
            onClick={handleContinueShopping}
            className="w-full"
            variant="outline"
            size="large"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
