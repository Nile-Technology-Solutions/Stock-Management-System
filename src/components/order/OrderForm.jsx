import { useState } from 'react';
import Button from '../common/Button';

const OrderForm = ({ 
  onSubmit, 
  loading = false, 
  className = "",
  initialData = {} 
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    phoneNumber: initialData.phoneNumber || '',
    email: initialData.email || '',
    deliveryLocation: initialData.deliveryLocation || '',
    additionalNotes: initialData.additionalNotes || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.deliveryLocation.trim()) {
      newErrors.deliveryLocation = 'Delivery location is required';
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Customer Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 ${
              errors.fullName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 ${
              errors.phoneNumber ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your phone number"
            disabled={loading}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Email (Optional) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address <span className="text-slate-500">(Optional)</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 ${
              errors.email ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Delivery Location */}
        <div>
          <label htmlFor="deliveryLocation" className="block text-sm font-medium text-slate-700 mb-2">
            Delivery Location *
          </label>
          <textarea
            id="deliveryLocation"
            value={formData.deliveryLocation}
            onChange={(e) => handleChange('deliveryLocation', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 resize-none ${
              errors.deliveryLocation ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter complete delivery address including city and postal code"
            disabled={loading}
          />
          {errors.deliveryLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-slate-700 mb-2">
            Additional Notes <span className="text-slate-500">(Optional)</span>
          </label>
          <textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 resize-none"
            placeholder="Any special instructions or requirements for your order"
            disabled={loading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="flex-1 sm:flex-none sm:min-w-[140px]"
            size="large"
          >
            Place Order
          </Button>
          <Button
            type="button"
            variant="glass-secondary"
            disabled={loading}
            className="flex-1 sm:flex-none sm:min-w-[100px]"
            size="large"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>

        {/* Required Fields Note */}
        <p className="text-xs text-slate-500 pt-2">
          * Required fields
        </p>
      </form>
    </div>
  );
};

export default OrderForm;