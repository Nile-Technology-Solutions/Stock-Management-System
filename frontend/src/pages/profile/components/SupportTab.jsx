import { useState } from 'react';
import { profileApi } from '../../../services/profileApi';

const SupportTab = () => {
  const [formData, setFormData] = useState({
    priority: 'medium',
    category: 'general',
    subject: '',
    description: '',
    orderId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      
      await profileApi.contactSupport(formData);
      
      setMessage({ 
        type: 'success', 
        text: 'Support ticket created successfully! Our team will get back to you within 24 hours.' 
      });
      
      // Reset form
      setFormData({
        priority: 'medium',
        category: 'general',
        subject: '',
        description: '',
        orderId: ''
      });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Failed to submit support request. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Contact Customer Support
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Need help? Our support team is here to assist you.
          </p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value="low">Low - General inquiry</option>
                <option value="medium">Medium - Need assistance</option>
                <option value="high">High - Urgent issue</option>
                <option value="critical">Critical - Service disruption</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Issue Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value="general">General Question</option>
                <option value="order">Order Issue</option>
                <option value="payment">Payment Problem</option>
                <option value="delivery">Delivery Issue</option>
                <option value="product">Product Quality</option>
                <option value="account">Account Issue</option>
                <option value="technical">Technical Problem</option>
                <option value="refund">Refund Request</option>
              </select>
            </div>
          </div>

          {/* Order ID (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Order ID (Optional)
            </label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              placeholder="e.g., #1234"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Brief description of your issue"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Please provide as much detail as possible about your issue..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              'Submit Support Request'
            )}
          </button>
        </form>
      </div>

      {/* Quick Help Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQ */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            📚 Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                How do I track my order?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Go to Purchase History tab and click "Track Order" on any order.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                What payment methods do you accept?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                We accept Chapa and Telebirr payment methods.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                How long does delivery take?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Standard delivery takes 3-5 business days within Ethiopia.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            📞 Other Ways to Reach Us
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📧</div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">Email</h4>
                <p className="text-sm text-cyan-600 dark:text-cyan-400">support@company.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">Phone</h4>
                <p className="text-sm text-cyan-600 dark:text-cyan-400">+251 911 234 567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🕐</div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">Business Hours</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Mon-Fri: 9AM - 6PM EAT</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">Response Time</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTab;
