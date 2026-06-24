import { useEffect, useState } from 'react';
import { Trash2, Mail, Clock } from 'lucide-react';
import { contactsAPI } from '../../utils/api';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    try {
      const data = await contactsAPI.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactsAPI.delete(id);
      await loadContacts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete message');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Contact Messages</h1>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No contact messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <a href={`mailto:${contact.email}`} className="text-sm text-forest-600 hover:text-forest-700">{contact.email}</a>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <Clock className="w-3 h-3" /> {formatDate(contact.created_at)}
                  </div>
                  <p className="text-gray-700">{contact.message}</p>
                </div>
                <button onClick={() => handleDelete(contact.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete Message">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
