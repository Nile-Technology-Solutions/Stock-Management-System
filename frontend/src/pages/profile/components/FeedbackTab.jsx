import { useState } from 'react';
import { profileApi } from '../../../services/profileApi';

const FeedbackTab = () => {
  const [formData, setFormData] = useState({
    category: 'general',
    rating: 5,
    subject: '',
    message: ''
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
      
      await profileApi.submitFeedback(formData);
      
      setMessage({ 
        type: 'success', 
        text: 'Thank you for your feedback! We appreciate your input.' 
      });
      
      // Reset form
      setFormData({
        category: 'general',
        rating: 5,
        subject: '',
        message: ''
      });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Failed to submit feedback. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Share Your Feedback
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We'd love to hear your thoughts, suggestions, or concerns about our service.
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
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Feedback Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          >
            <option value="general">General Feedback</option>
            <option value="product">Product Quality</option>
            <option value="service">Customer Service</option>
            <option value="website">Website Experience</option>
            <option value="delivery">Delivery & Shipping</option>
            <option value="suggestion">Suggestion</option>
            <option value="complaint">Complaint</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Overall Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className="text-4xl transition-all duration-200 hover:scale-110"
              >
                {star <= formData.rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {formData.rating === 5 && 'Excellent!'}
            {formData.rating === 4 && 'Very Good'}
            {formData.rating === 3 && 'Good'}
            {formData.rating === 2 && 'Fair'}
            {formData.rating === 1 && 'Needs Improvement'}
          </p>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Brief summary of your feedback"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your Feedback
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Please share your detailed feedback here..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </span>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>

      {/* Additional Info */}
      <div className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
          💡 Your Voice Matters
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Every piece of feedback helps us improve our products and services. We review all submissions and use them to enhance your experience.
        </p>
      </div>
    </div>
  );
};

export default FeedbackTab;
