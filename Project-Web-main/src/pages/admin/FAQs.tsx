import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, HelpCircle, X } from 'lucide-react';
import { faqsAPI } from '../../utils/api';

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadFAQs(); }, []);

  const loadFAQs = async () => {
    try {
      const data = await faqsAPI.getAll();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingFAQ) {
        await faqsAPI.update(editingFAQ.id, formData);
      } else {
        await faqsAPI.create(formData);
      }
      await loadFAQs();
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await faqsAPI.delete(id);
      await loadFAQs();
    } catch (err: any) {
      alert(err.message || 'Failed to delete FAQ');
    }
  };

  const openModal = (faq?: any) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({ question: faq.question, answer: faq.answer });
    } else {
      setEditingFAQ(null);
      setFormData({ question: '', answer: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFAQ(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Manage FAQs</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700">
          <Plus className="w-5 h-5" /> Add FAQ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Question</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Answer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {faqs.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No FAQs found</td></tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">#{faq.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{faq.question}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-sm truncate">{faq.answer}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(faq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-display text-xl font-bold text-gray-900">{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                <input type="text" required value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
                <textarea rows={4} required value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50">
                  <HelpCircle className="w-4 h-4" /> {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
