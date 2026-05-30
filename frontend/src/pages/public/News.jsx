import { useState, useEffect } from 'react';
import { stockApi } from '../../services/stockApi';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchNews(); }, []);

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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-stone-900 to-amber-950 text-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
              AddHomes Updates
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Latest{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              News
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Stay up to date with our newest collections, project showcases, and company announcements.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size="large" text="Loading articles..." />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchNews} />
        ) : news.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="We're working on new content — check back soon for updates and announcements."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <article
                key={article.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:border-amber-300/50 dark:hover:border-amber-700/40 transition-all duration-300"
              >
                {/* Image */}
                {article.image ? (
                  <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10" />
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Article number badge */}
                    <div className="absolute top-4 left-4 z-20 w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-black">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                ) : (
                  /* Decorative placeholder when no image */
                  <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-amber-300 dark:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-3">
                  {/* Date */}
                  {article.publishedAt && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(article.publishedAt)}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  {article.content && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {article.content}
                    </p>
                  )}

                  {/* Author */}
                  {article.author && (
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">By {article.author}</span>
                    </div>
                  )}
                </div>

                {/* Bottom accent bar */}
                <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </article>
            ))}
          </div>
        )}

        {/* Article count */}
        {!loading && !error && news.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/30 rounded-full text-sm font-semibold text-amber-700 dark:text-amber-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              {news.length} article{news.length !== 1 ? 's' : ''} published
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
