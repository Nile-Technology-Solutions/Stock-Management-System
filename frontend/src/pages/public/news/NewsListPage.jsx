import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../../../components/common/GlassCard';
import { newsApi } from '../../../services/newsApi';
import { Search, Filter, Calendar, ArrowRight, BookOpen } from '../../../components/icons';
import { getImageUrl } from '../../../utils/imageHelper';

const NewsListPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        console.log('📰 Fetching news from API...');
        console.log('📰 API URL:', `${window.location.origin}/api/news`);

        const data = await newsApi.getNews();

        console.log('📰 Raw API response:', data);
        console.log('📰 Response type:', typeof data);
        console.log('📰 Is array?', Array.isArray(data));
        console.log('📰 Data length:', Array.isArray(data) ? data.length : 'N/A');

        const newsArray = Array.isArray(data) ? data : [];
        console.log('📰 News array:', newsArray);

        if (newsArray.length > 0) {
          console.log('📰 First news item:', newsArray[0]);
          console.log('📰 Published news:', newsArray.filter(n => n.status === 'Published'));
        } else {
          console.warn('⚠️ API returned empty array - Backend might not be returning data');
        }

        setNews(newsArray);
      } catch (error) {
        console.error('❌ Failed to fetch news:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);

        // Show user-friendly error
        alert(`Failed to load news: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. Database has news records\n3. Browser console for details`);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = useMemo(() => {
    const publishedNews = news.filter(n => n.status === 'Published');
    // Since we removed categories, just show "All"
    return ['All'];
  }, [news]);

  const sortedAndFilteredNews = useMemo(() => {
    return news
      .filter(n => n.status === 'Published')
      .filter(n => {
        const matchesSearch = (n.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (n.content || '').toLowerCase().includes(searchTerm.toLowerCase());
        // Removed category filter since we don't use categories anymore
        return matchesSearch;
      })
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }, [news, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Hero Section */}
      <div className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover"
            alt="News background"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Nile <span className="text-cyan-400">Insights</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Stay updated with the latest in wood technology, sustainable sourcing, and interior design trends in Ethiopia.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12">
        {/* Search & Filter Bar */}
        <GlassCard className="p-4 mb-12 shadow-2xl border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, technology, or trends..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-700 dark:text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                >
                  All Articles
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedAndFilteredNews.map(newsItem => (
                <Link key={newsItem.id} to={`/news/${newsItem.id}`} className="group">
                  <GlassCard className="h-full flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 group-hover:border-cyan-500/50">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={(newsItem.imageUrl || newsItem.image) ? getImageUrl(newsItem.imageUrl || newsItem.image) : 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800'}
                        alt={newsItem.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      {newsItem.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-cyan-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {newsItem.category}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-medium">
                        <Calendar className="w-3 h-3" />
                        {newsItem.publishDate ? new Date(newsItem.publishDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-cyan-500 transition-colors line-clamp-2">
                        {newsItem.title}
                      </h3>

                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {newsItem.content}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center group-hover:border-cyan-500/20">
                        <span className="text-xs font-black uppercase tracking-tighter text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                          Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        <BookOpen className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </>
        )}

        {!loading && sortedAndFilteredNews.length === 0 && (
          <div className="text-center py-40">
            <Search className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">No matching news articles</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsListPage;

