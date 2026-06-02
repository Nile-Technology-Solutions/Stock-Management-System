import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { superAdminApi } from '../../../services/superAdminApi';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import { UserPlus, Edit3, Trash2, Search, Filter, Shield, User, RefreshCw } from '../../../components/icons';

// Swagger User schema:
// id, fullName (required), username (required), password (required),
// role (required: Admin|Super Admin|Customer), phone

const ROLE_OPTIONS = ['Admin', 'SuperAdmin', 'Customer'];

const UserManagementPage = () => {
  const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    role: 'Customer',
    password: '',
    phone: '',
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: searchTerm || undefined,
        role: roleFilter !== 'All' ? roleFilter : undefined
      };

      const response = await superAdminApi.getUsers(params);
      const usersData = Array.isArray(response) ? response : (response.data || []);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pagination.currentPage, searchTerm, roleFilter]);

  const handleOpenAddModal = () => {
    setCurrentUser(null);
    setFormData({ fullName: '', username: '', role: 'Customer', password: '', phone: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName || '',
      username: user.username || '',
      role: user.role || 'Customer',
      password: '',
      phone: user.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (currentUser) {
        await superAdminApi.updateUser(currentUser.id, formData);
      } else {
        await superAdminApi.createUser(formData);
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser?.id) return;
    setFormLoading(true);
    try {
      await superAdminApi.deleteUser(currentUser.id);
      setIsDeleteModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: 'fullName',
      render: (value, user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800/30 dark:to-orange-800/30 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-xs text-slate-500">@{user.username}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (role) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          role === 'SuperAdmin' 
            ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50' 
            : role === 'Admin' 
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50' 
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}>
          {role === 'SuperAdmin' ? 'Super Admin' : role}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenEditModal(user)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => { setCurrentUser(user); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg shadow-amber-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 ml-12">Manage system users, roles, and permissions</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20"
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add User
        </Button>
      </div>

      {/* Filters & Table */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400" 
              placeholder="Search users by name or username..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="pl-9 pr-8 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
              value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r === 'SuperAdmin' ? 'Super Admin' : r}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <Table columns={columns} data={users} />
        )}
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
              <input required name="fullName" value={formData.fullName} onChange={handleInputChange} 
                className="w-full px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username *</label>
              <input required name="username" value={formData.username} onChange={handleInputChange} 
                className="w-full px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role *</label>
              <select name="role" value={formData.role} onChange={handleInputChange} 
                className="w-full px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all">
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r === 'SuperAdmin' ? 'Super Admin' : r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleInputChange} 
                className="w-full px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{currentUser ? 'New Password' : 'Password *'}</label>
            <input required={!currentUser} name="password" type="password" value={formData.password} onChange={handleInputChange} 
              className="w-full px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all" />
            {currentUser && <p className="text-xs text-slate-400">Leave blank to keep current password</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : currentUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete User">
        <div className="pt-4 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-slate-100">{currentUser?.fullName}</strong>? 
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" onClick={handleDelete} disabled={formLoading}>
              {formLoading ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;