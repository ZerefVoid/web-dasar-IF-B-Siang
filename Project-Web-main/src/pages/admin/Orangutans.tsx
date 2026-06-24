import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Heart, X } from 'lucide-react';
import { orangutansAPI } from '../../utils/api';

export default function AdminOrangutans() {
  const [orangutans, setOrangutans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrangutan, setEditingOrangutan] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', gender: 'Male', birth_year: '', age: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadOrangutans(); }, []);

  const loadOrangutans = async () => {
    try {
      const data = await orangutansAPI.getAll();
      setOrangutans(data);
    } catch (error) {
      console.error('Error loading orangutans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
        age: formData.age ? parseInt(formData.age) : null,
      };

      if (editingOrangutan) {
        await orangutansAPI.update(editingOrangutan.id, submitData);
      } else {
        await orangutansAPI.create(submitData);
      }
      await loadOrangutans();
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save orangutan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this orangutan?')) return;

    try {
      await orangutansAPI.delete(id);
      await loadOrangutans();
    } catch (err: any) {
      alert(err.message || 'Failed to delete orangutan');
    }
  };

  const openModal = (orangutan?: any) => {
    if (orangutan) {
      setEditingOrangutan(orangutan);
      setFormData({
        name: orangutan.name,
        gender: orangutan.gender,
        birth_year: orangutan.birth_year?.toString() || '',
        age: orangutan.age?.toString() || '',
        description: orangutan.description || '',
      });
    } else {
      setEditingOrangutan(null);
      setFormData({ name: '', gender: 'Male', birth_year: '', age: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOrangutan(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading orangutans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Manage Orangutans</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700">
          <Plus className="w-5 h-5" /> Add Orangutan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gender</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Birth Year</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orangutans.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orangutans found</td></tr>
              ) : (
                orangutans.map((orangutan) => (
                  <tr key={orangutan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{orangutan.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${orangutan.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                        {orangutan.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{orangutan.age || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{orangutan.birth_year || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(orangutan)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(orangutan.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-display text-xl font-bold text-gray-900">{editingOrangutan ? 'Edit Orangutan' : 'Add New Orangutan'}</h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input type="number" value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year</label>
                  <input type="number" value={formData.birth_year}
                    onChange={(e) => setFormData({ ...formData, birth_year: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={4} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50">
                  <Heart className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Orangutan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
