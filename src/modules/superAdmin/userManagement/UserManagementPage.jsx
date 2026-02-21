import { useState, useEffect } from 'react';
import { mockUsers } from '../../../services/mockData';
import { ROLES as ROLE_CONSTANTS } from '../../../utils/roleUtils';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import { UserPlus, Edit3, Trash2, Search, Filter, Shield, User } from '../../../components/icons';
import { getRoleDisplayName } from '../../../utils/roleUtils';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    role: 'Customer',
    password: ''
  });

  useEffect(() => {
    // Initialize with mock users
    setUsers(mockUsers);
  }, []);

  const handleOpenAddModal = () => {
    setCurrentUser(null);
    setFormData({
      fullName: '',
      username: '',
      email: '',
      role: 'Customer',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' // Don't show password
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (currentUser) {
      // Update
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...formData } : u));
    } else {
      // Add
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData
      };
      setUsers(prev => [...prev, newUser]);
    }
    
    setFormLoading(false);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    setFormLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    setFormLoading(false);
    setIsDeleteModalOpen(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      header: 'User',
      accessor: 'fullName',
      render: (value, user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (role) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          role === 'Super Admin' 
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            : role === 'Admin'
            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
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
          <button 
            onClick={() => handleOpenEditModal(user)}
            className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleOpenDeleteModal(user)}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <UserPlus className="w-5 h-5" />
          Add New User
        </Button>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, username or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-700 dark:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-700 dark:text-slate-200"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredUsers}
          pagination={true}
          pageSize={5}
        />
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                required
                name="fullName"
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <input
                required
                name="username"
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="johndoe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              required
              name="email"
              type="email"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select
              name="role"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <div className="space-y-1.5 pb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {currentUser ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              required={!currentUser}
              name="password"
              type="password"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={formLoading}
            >
              {formLoading ? 'Saving...' : currentUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="pt-4 space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3">
            <Shield className="w-10 h-10 text-red-500" />
            <p className="text-sm text-red-800 dark:text-red-300">
              Warning: This action cannot be undone. All data associated with <strong>{currentUser?.fullName}</strong> will be permanently removed.
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Keep User
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 shadow-lg shadow-red-500/20"
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
