import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-sky-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Manage inventory and fulfill orders -{' '}
                  <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent">
                    the right way
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Successful business relies on successful inventory management. Automate your inventory operations and sell more with less effort.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button
                    variant="primary"
                    size="large"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 min-w-[200px] text-white font-semibold"
                  >
                    SIGN UP - IT'S FREE
                  </Button>
                </Link>
                <Link to="/order-tracking">
                  <Button
                    variant="secondary"
                    size="large"
                    className="border-2 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 min-w-[200px] font-semibold"
                  >
                    TRACK YOUR ORDER
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Image with Floating Cards */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Main Image Container */}
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&q=80" 
                  alt="Professional working on laptop"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                
                {/* Floating UI Cards */}
                {/* Sales Order Card - Top Left */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-700 animate-float backdrop-blur-sm">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">Sales Order</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">Jan</span>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">Qty</span>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">Status</span>
                    <span className="px-2 py-1 bg-cyan-500 text-white rounded">Add</span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    Total: <span className="text-cyan-500">$275</span>
                  </div>
                </div>

                {/* Total Sales Card - Top Right */}
                <div className="absolute -top-8 -right-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-700 animate-float backdrop-blur-sm" style={{ animationDelay: '1s' }}>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Sales</div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">2340</div>
                      <div className="text-xs text-cyan-500 font-medium">To be paid</div>
                    </div>
                  </div>
                </div>

                {/* Orders Card - Middle Right */}
                <div className="absolute top-1/3 -right-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-3 border border-slate-200 dark:border-slate-700 animate-float backdrop-blur-sm" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">4190</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">To be fulfilled</div>
                    </div>
                  </div>
                </div>

                {/* Shipped Card - Bottom Right */}
                <div className="absolute bottom-8 -right-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-3 border border-slate-200 dark:border-slate-700 animate-float backdrop-blur-sm" style={{ animationDelay: '3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">1616</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">To be shipped</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Trusted by successful companies worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Powerful Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Advanced inventory management with cutting-edge technology and seamless integrations
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 - Smart Inventory */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 hover:border-cyan-400/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-cyan-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Smart Inventory Control
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  AI-powered stock management with automated reorder points and predictive analytics.
                </p>
                <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 2 - Real-time Analytics */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-2 hover:border-sky-400/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-sky-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Real-time Analytics
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Live dashboards with actionable insights, sales trends, and performance metrics.
                </p>
                <div className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 3 - Multi-channel Integration */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-400/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Multi-channel Integration
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Seamlessly connect with e-commerce platforms, marketplaces, and payment gateways.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 4 - Automated Workflows */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 hover:border-purple-400/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Automated Workflows
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Streamline operations with intelligent automation for orders, invoicing, and fulfillment.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 5 - Secure Payments */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 hover:border-green-400/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-green-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Secure Payment Processing
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Bank-grade encryption with Chapa and Telebirr integration for safe transactions.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 6 - Advanced Tracking */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 hover:border-orange-400/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Advanced Order Tracking
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  GPS-enabled tracking with real-time notifications and delivery status updates.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                150+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Integrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Futuristic Design */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main CTA Card */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
            
            {/* Card Content */}
            <div className="relative bg-gradient-to-br from-slate-900/90 via-cyan-900/90 to-blue-900/90 dark:from-slate-950/90 dark:via-cyan-950/90 dark:to-blue-950/90 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl overflow-hidden">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
              
              <div className="relative p-12 md:p-16 lg:p-20">
                {/* Badge */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                      Limited Time Offer
                    </span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-sky-100 bg-clip-text text-transparent">
                    Ready to Get Started?
                  </span>
                </h2>
                
                {/* Subheading */}
                <p className="text-xl md:text-2xl text-center text-cyan-100/80 mb-4 max-w-3xl mx-auto leading-relaxed">
                  {isAuthenticated 
                    ? "Explore our premium products and place your order with exclusive member benefits"
                    : "Join thousands of satisfied customers and experience the future of inventory management"
                  }
                </p>
                
                {/* Features List */}
                {!isAuthenticated && (
                  <div className="flex flex-wrap justify-center gap-6 mb-12 mt-8">
                    <div className="flex items-center gap-2 text-cyan-200">
                      <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Free Account</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-200">
                      <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Instant Setup</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-200">
                      <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-200">
                      <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Secure Payments</span>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                  {!isAuthenticated ? (
                    <>
                      {/* Primary CTA - Sign Up */}
                      <Link to="/register" className="group/btn relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                        <button className="relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-400 text-white font-bold text-lg rounded-xl shadow-2xl shadow-cyan-500/50 transition-all duration-300 group-hover/btn:scale-105 group-hover/btn:shadow-cyan-500/70">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>START FREE TODAY</span>
                          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </Link>

                      {/* Secondary CTA - Login */}
                      <Link to="/login" className="group/btn relative">
                        <button className="relative flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg rounded-xl border-2 border-cyan-400/50 hover:border-cyan-400 shadow-lg transition-all duration-300 group-hover/btn:scale-105">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>SIGN IN</span>
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* Authenticated User CTAs */}
                      <Link to="/products" className="group/btn relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                        <button className="relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-400 text-white font-bold text-lg rounded-xl shadow-2xl shadow-cyan-500/50 transition-all duration-300 group-hover/btn:scale-105">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>BROWSE PRODUCTS</span>
                          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </Link>

                      <Link to="/dashboard" className="group/btn relative">
                        <button className="relative flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg rounded-xl border-2 border-cyan-400/50 hover:border-cyan-400 shadow-lg transition-all duration-300 group-hover/btn:scale-105">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                          <span>MY DASHBOARD</span>
                        </button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Secondary Actions Row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                  {/* Track Order - Always Visible */}
                  <Link to="/order-tracking" className="group/btn relative">
                    <button className="relative flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 backdrop-blur-sm text-orange-200 hover:text-orange-100 font-semibold rounded-lg border border-orange-400/50 hover:border-orange-400 shadow-lg transition-all duration-300 group-hover/btn:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Track Order</span>
                    </button>
                  </Link>

                  {/* Latest News */}
                  <Link to="/news" className="group/btn relative">
                    <button className="relative flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-cyan-200 hover:text-cyan-100 font-semibold rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 group-hover/btn:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <span>Latest News</span>
                    </button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                {!isAuthenticated && (
                  <div className="mt-12 pt-8 border-t border-cyan-500/20">
                    <p className="text-center text-cyan-200/60 text-sm mb-6">
                      Trusted by 50,000+ businesses worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                      {/* Trust Badges */}
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-cyan-200 text-sm font-medium">SSL Secured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-cyan-200 text-sm font-medium">Money Back Guarantee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-cyan-200 text-sm font-medium">Verified Platform</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Card 1 */}
            <div className="relative group/card">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-2xl blur opacity-30 group-hover/card:opacity-60 transition duration-300" />
              <div className="relative bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Quick Setup</h3>
                <p className="text-cyan-200/70 text-sm">Get started in under 5 minutes with our intuitive onboarding</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group/card">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30 group-hover/card:opacity-60 transition duration-300" />
              <div className="relative bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-sky-500/20 p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bank-Level Security</h3>
                <p className="text-cyan-200/70 text-sm">Your data is protected with enterprise-grade encryption</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative group/card">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover/card:opacity-60 transition duration-300" />
              <div className="relative bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">24/7 Support</h3>
                <p className="text-cyan-200/70 text-sm">Expert assistance whenever you need it, day or night</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
