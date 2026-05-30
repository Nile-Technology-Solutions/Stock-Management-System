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
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <div className="font-semibold">{value}</div>
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
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${role === 'SuperAdmin' ? 'bg-purple-100 text-purple-700' :
          role === 'Admin' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-700'
          }`}>
          {role}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenEditModal(user)} className="p-2 text-slate-400 hover:text-cyan-500"><Edit3 className="w-4 h-4" /></button>
          <button onClick={() => { setCurrentUser(user); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-slate-500">Manage system users and roles</p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}><UserPlus className="w-5 h-5 mr-2" /> Add User</Button>
      </div>

      <GlassCard className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-xl" placeholder="Search users..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-xl px-4 py-2" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {loading ? <div className="text-center py-10">Loading...</div> : <Table columns={columns} data={users} />}
      </GlassCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name *</label>
              <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Username *</label>
              <input required name="username" value={formData.username} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Role *</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg">
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">{currentUser ? 'New Password' : 'Password *'}</label>
            <input required={!currentUser} name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : 'Save User'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete User">
        <div className="pt-4 space-y-4">
          <p>Are you sure you want to delete <strong>{currentUser?.fullName}</strong>?</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 bg-red-500" onClick={handleDelete} disabled={formLoading}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
