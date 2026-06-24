import { useEffect, useState } from 'react';
import { TrendingUp, Users, Heart, DollarSign, Newspaper } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { adminAPI } from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const result = await adminAPI.getDashboard();
      setData(result);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Orangutans', value: data?.statistics?.totalOrangutans || 0, icon: Heart, color: 'text-red-500', bg: 'bg-red-100' },
    { label: 'Total Users', value: data?.statistics?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Total Donations', value: data?.statistics?.totalDonations || 0, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Total Articles', value: data?.statistics?.totalArticles || 0, icon: Newspaper, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Total Donors', value: data?.statistics?.totalDonors || 0, icon: Users, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Total Amount', value: formatCurrency(data?.statistics?.totalDonationAmount || 0), icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-100' },
  ];

  const monthlyData = {
    labels: data?.monthlyDonations?.map((d: any) => d.month) || [],
    datasets: [{ label: 'Donations', data: data?.monthlyDonations?.map((d: any) => d.total) || [], backgroundColor: '#16a34a', borderRadius: 4 }],
  };

  const yearlyData = {
    labels: data?.yearlyDonations?.map((d: any) => d.year.toString()) || [],
    datasets: [{ label: 'Donations', data: data?.yearlyDonations?.map((d: any) => d.total) || [], borderColor: '#16a34a', backgroundColor: '#16a34a', tension: 0.4, pointRadius: 6 }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context: any) => formatCurrency(context.raw) } } },
    scales: { y: { ticks: { callback: (value: any) => formatShortCurrency(value) } } },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Monthly Donations</h2>
          <div className="h-72"><Bar data={monthlyData} options={chartOptions} /></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Yearly Donations</h2>
          <div className="h-72"><Line data={yearlyData} options={chartOptions} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Recent Donations</h2>
          {data?.recentDonations?.length > 0 ? (
            <div className="space-y-4">
              {data.recentDonations.slice(0, 5).map((donation: any) => (
                <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{donation.full_name}</p>
                    <p className="text-sm text-gray-500">{donation.payment_method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-forest-600">{formatCurrency(donation.amount)}</p>
                    <p className="text-xs text-gray-400">{formatDate(donation.donated_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (<p className="text-gray-500 text-center py-8">No recent donations</p>)}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Recent Users</h2>
          {data?.recentUsers?.length > 0 ? (
            <div className="space-y-4">
              {data.recentUsers.slice(0, 5).map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-forest-100 text-forest-700 rounded">{user.badge}</span>
                </div>
              ))}
            </div>
          ) : (<p className="text-gray-500 text-center py-8">No recent users</p>)}
        </div>
      </div>
    </div>
  );
}
