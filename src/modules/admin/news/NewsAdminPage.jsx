import { useState, useMemo } from 'react';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import { mockNews } from '../../../services/mockData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Image as ImageIcon,
  Search,
  Filter,
  MoreVertical
} from '../../../components/icons';

const NewsAdminPage = () => {
  const [articles, setArticles] = useState(mockNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    content: '',
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800'
  });

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'General',
      content: '',
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      content: article.content,
      status: article.status,
      image: article.image
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingArticle) {
      setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...formData } : a));
    } else {
      const newArticle = {
        id: Math.max(...articles.map(a => a.id)) + 1,
        ...formData,
        publishDate: new Date().toISOString()
      };
      setArticles(prev => [newArticle, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Article Info',
      accessor: 'title',
      render: (title, article) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
            <img src={article.image} className="w-full h-full object-cover" alt="" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{title}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 px-1.5 py-0.5 rounded">
                {article.category}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(article.publishDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => {
        const styles = {
          'Published': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          'Draft': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
          'Archived': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        const icons = {
          'Published': <CheckCircle className="w-3 h-3" />,
          'Draft': <FileText className="w-3 h-3" />,
          'Archived': <AlertCircle className="w-3 h-3" />
        };
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${styles[status]}`}>
            {icons[status]}
            {status}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, article) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEdit(article)}
            className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
            title="Edit Article"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <GlassCard variant="standard" className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-gradient-to-r from-slate-900 to-indigo-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <FileText className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black mb-1 uppercase tracking-tight">
                News <span className="text-cyan-400">Editorial</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium">Manage corporate communications and public insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <Button 
               variant="glass-secondary" 
               className="bg-white/5 hover:bg-white/10 border-white/10 text-white"
               onClick={() => window.location.reload()}
             >
               <RefreshCw className="w-4 h-4" />
             </Button>
             <Button variant="primary" className="bg-cyan-500 border-none shadow-lg shadow-cyan-500/25" onClick={handleOpenAdd}>
               <Plus className="w-5 h-5 mr-1" /> Create Post
             </Button>
          </div>
        </div>
      </GlassCard>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none shadow-sm font-medium text-slate-700 dark:text-slate-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <GlassCard className="p-4 border-none shadow-sm overflow-hidden">
        <Table 
          columns={columns} 
          data={filteredArticles} 
          pagination={true}
          pageSize={5}
        />
      </GlassCard>

      {/* Editorial Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? 'Edit Article' : 'Compose News Article'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
             {/* Image Preview / Field */}
             <div className="relative group">
                <div className="h-40 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700">
                   <img src={formData.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-cyan-500 transition-colors pointer-events-none">
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Update Banner</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Article Title</label>
                  <input
                    required
                    name="title"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="Enter headline..."
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category & Type</label>
                  <select
                    name="category"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Sustainability">Sustainability</option>
                    <option value="Technology">Technology</option>
                    <option value="Events">Events</option>
                    <option value="General">General News</option>
                  </select>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Article Status</label>
                <div className="flex gap-4">
                  {['Draft', 'Published', 'Archived'].map(s => (
                    <label key={s} className="flex-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value={s} 
                        checked={formData.status === s}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className={`p-3 rounded-xl border-2 text-center text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.status === s 
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600' 
                        : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                         {s}
                      </div>
                    </label>
                  ))}
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Detailed Content</label>
                <textarea
                  required
                  name="content"
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                  placeholder="Start writing the article narrative..."
                  value={formData.content}
                  onChange={handleInputChange}
                />
             </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 font-black uppercase text-xs"
              onClick={() => setIsModalOpen(false)}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-cyan-500 border-none font-black uppercase text-xs tracking-widest"
            >
              {editingArticle ? 'Update Publication' : 'Release Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewsAdminPage;
