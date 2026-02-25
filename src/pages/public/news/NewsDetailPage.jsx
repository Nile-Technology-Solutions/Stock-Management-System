import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../../../services/newsApi';
import GlassCard from '../../../components/common/GlassCard';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin, Tag } from '../../../components/icons';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const item = await newsApi.getNewsById(id);
        setNewsItem(item);

        // Fetch all news to get related posts
        const allNews = await newsApi.getNews();
        if (Array.isArray(allNews)) {
          setRelatedNews(
            allNews
              .filter(n => String(n.id) !== String(id) && n.status === 'Published')
              .slice(0, 3)
          );
        }
      } catch (error) {
        console.error('Failed to fetch news detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Article Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The news article you are looking for might have been moved or deleted.</p>
          <Link to="/news">
            <button className="w-full bg-cyan-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-600">
              Back to News
            </button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Article Header with Parallax-style background */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img 
          src={newsItem.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=1200'} 
          className="w-full h-full object-cover"
          alt={newsItem.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-10">
          <div className="container mx-auto px-6">
            <Link to="/news" className="inline-flex items-center text-cyan-400 font-black text-xs uppercase tracking-widest mb-6 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Article Directory
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest rounded">
                {newsItem.category}
              </span>
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                <Calendar className="w-4 h-4" />
                {newsItem.publishDate ? new Date(newsItem.publishDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : 'N/A'}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white max-w-4xl leading-tight">
              {newsItem.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 -mt-10 relative z-20">
          {/* Main Content */}
          <div className="flex-1">
            <GlassCard className="p-8 md:p-12 mb-12 shadow-2xl border-white/10 dark:border-slate-800">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-cyan-500">
                  {newsItem.content}
                </p>
                {/* Additional content could go here if available from API */}
              </div>

              {/* Share Box */}
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share Article
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-sky-400 hover:text-white transition-all">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                      <Linkedin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <Tag className="w-4 h-4 text-cyan-500" />
                   <span className="text-xs font-bold text-slate-400">#NileTechnology #Innovation #EthiopiaDesign</span>
                </div>
              </div>
            </GlassCard>
            
            {/* Author Section */}
            <GlassCard className="p-6 mb-12 flex items-center gap-6 border-none bg-slate-900 text-white">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-black text-2xl">
                 NT
               </div>
               <div>
                  <h4 className="font-bold text-lg mb-0.5">Nile Editorial Team</h4>
                  <p className="text-slate-400 text-sm">Official publication for Nile Technology & Wood Solutions. Providing expert insights into manufacturing excellence.</p>
               </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="lg:w-96 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3 underline decoration-cyan-500 decoration-4 underline-offset-8">
              Recent Posts
            </h3>
            <div className="space-y-6">
              {relatedNews.map(item => (
                <Link key={item.id} to={`/news/${item.id}`} className="group block">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.title} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 mb-1 block">
                        {(item.category || 'News').toUpperCase()}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                        {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <GlassCard className="p-8 bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-none shadow-2xl shadow-cyan-500/20">
               <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Get The Latest Insights</h3>
               <p className="text-cyan-100 text-sm mb-6 leading-relaxed">Join 5,000+ industry professionals receiving our monthly technology digest.</p>
               <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Work email address"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none placeholder:text-white/40 text-white focus:bg-white/20 transition-all font-medium"
                   />
                   <button className="w-full bg-white text-cyan-600 font-black py-3 rounded-xl shadow-xl shadow-cyan-900/10 hover:bg-cyan-50 transition-colors uppercase text-xs tracking-widest">
                     Subscribe Now
                   </button>
               </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;

