import { useEffect, useState } from 'react';
import { Trash2, Award, Ban, CheckCircle } from 'lucide-react';
import { usersAPI } from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await usersAPI.updateStatus(user.id, newStatus);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? All their donations will also be deleted.')) return;

    try {
      await usersAPI.delete(id);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case 'Rainforest Guardian': return 'badge-guardian';
      case 'Orangutan Protector': return 'badge-protector';
      default: return 'badge-friend';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading users...</p>
      </div>
    );
  }

  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const suspendedUsers = users.filter((u) => u.status === 'Suspended').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
          <p className="text-sm text-gray-500">Active Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-3xl font-bold text-red-600">{suspendedUsers}</p>
          <p className="text-sm text-gray-500">Suspended Users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Badge</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getBadgeStyles(user.badge)}`}>{user.badge}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 text-sm font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                        {user.status === 'Active' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />} {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-lg ${user.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}>
                          {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
