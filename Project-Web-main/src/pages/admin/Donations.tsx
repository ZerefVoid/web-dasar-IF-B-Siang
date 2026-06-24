import { useEffect, useState } from 'react';
import { DollarSign, CheckCircle } from 'lucide-react';
import { donationsAPI } from '../../utils/api';

export default function AdminDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => { loadDonations(); }, []);

  const loadDonations = async () => {
    try {
      const [donationsData, statsData] = await Promise.all([
        donationsAPI.getAll(),
        donationsAPI.getStatistics(),
      ]);
      setDonations(donationsData);
      setStats({ total: statsData.total.total, count: statsData.total.count });
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading donations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
              <p className="text-sm text-gray-500">Total Donations Amount</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
              <p className="text-sm text-gray-500">Total Transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-display text-xl font-bold text-gray-900">All Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Donor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {donations.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No donations found</td></tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">#{donation.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{donation.full_name}</p>
                      <p className="text-sm text-gray-500">{donation.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-forest-600">{formatCurrency(donation.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">{donation.payment_method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(donation.donated_at)}</td>
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
