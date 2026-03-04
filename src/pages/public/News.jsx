import { useState, useEffect } from 'react';
import { stockApi } from '../../services/stockApi';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockApi.getNews();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-sky-50/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 dark:from-cyan-600 dark:via-sky-600 dark:to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Latest News
            </h1>
            <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto">
              Stay updated with our latest announcements and updates
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="large" text="Loading news..." />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchNews} />
        ) : news.length === 0 ? (
          <EmptyState
            title="No news available"
            description="Check back later for updates and announcements"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <article
                key={article.id}
                className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-cyan-400/30"
              >
                {/* Image */}
                {article.image && (
                  <div className="relative aspect-w-16 aspect-h-9 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  {article.publishedAt && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
                    {article.title}
                  </h2>

                  {/* Excerpt/Content */}
                  {article.content && (
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                  )}

                  {/* Author */}
                  {article.author && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>By {article.author}</span>
                    </div>
                  )}
                </div>

                {/* Hover Effect Line */}
                <div className="h-1 bg-gradient-to-r from-cyan-400 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </article>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && news.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{news.length}</span> article{news.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
