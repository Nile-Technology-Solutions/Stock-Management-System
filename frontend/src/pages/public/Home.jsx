import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-blue-500/10 dark:from-cyan-600/20 dark:via-sky-600/20 dark:to-blue-600/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 animate-fade-in-up">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent">
                Stock Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover quality products and place orders with ease. Track your orders in real-time and stay updated with our latest news.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/products">
                <Button
                  variant="primary"
                  size="large"
                  className="bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-500 hover:to-sky-500 shadow-lg shadow-cyan-400/30 min-w-[200px]"
                >
                  Browse Products
                </Button>
              </Link>
              <Link to="/order-tracking">
                <Button
                  variant="secondary"
                  size="large"
                  className="min-w-[200px]"
                >
                  Track Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Experience seamless ordering and tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-cyan-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Quality Products
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Browse our curated collection of premium products with detailed specifications and images.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-cyan-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Secure Payment
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Pay securely with Chapa or Telebirr. Your payment information is always protected.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-cyan-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Real-time Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Track your order status in real-time from submission to delivery completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 dark:from-cyan-600 dark:via-sky-600 dark:to-blue-600 rounded-2xl shadow-2xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-cyan-50 mb-8 max-w-2xl mx-auto">
              Explore our products and place your first order today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button
                  variant="secondary"
                  size="large"
                  className="bg-white hover:bg-slate-50 text-cyan-600 min-w-[200px]"
                >
                  View Products
                </Button>
              </Link>
              <Link to="/news">
                <Button
                  variant="ghost-secondary"
                  size="large"
                  className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 min-w-[200px]"
                >
                  Latest News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
