import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { donationsAPI } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7', '#f0fdf4', '#052e16'];

export default function Statistics() {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStatistics(); }, []);

  const loadStatistics = async () => {
    try {
      const data = await donationsAPI.getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const pieData = {
    labels: statistics?.byPaymentMethod?.map((item: any) => item.payment_method) || [],
    datasets: [{ data: statistics?.byPaymentMethod?.map((item: any) => item.total) || [], backgroundColor: COLORS }],
  };

  const monthlyData = {
    labels: statistics?.monthly?.slice().reverse().map((item: any) => item.month) || [],
    datasets: [{ label: 'Donations', data: statistics?.monthly?.slice().reverse().map((item: any) => item.total) || [], backgroundColor: '#16a34a', borderRadius: 4 }],
  };

  const yearlyData = {
    labels: statistics?.yearly?.map((item: any) => item.year.toString()) || [],
    datasets: [{ label: 'Donations', data: statistics?.yearly?.map((item: any) => item.total) || [], backgroundColor: '#22c55e', borderRadius: 4 }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context: any) => formatCurrency(context.raw) } },
    },
    scales: { y: { ticks: { callback: (value: any) => formatShortCurrency(value) } } },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
      tooltip: { callbacks: { label: (context: any) => `${context.label}: ${formatCurrency(context.raw)}` } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Donation Statistics</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Transparency is key to our mission. See how your donations are making a difference.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-3xl font-bold text-forest-600 mb-2">{formatCurrency(statistics?.total?.total || 0)}</p>
            <p className="text-gray-600">Total Donations</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-3xl font-bold text-forest-600 mb-2">{statistics?.total?.count || 0}</p>
            <p className="text-gray-600">Total Transactions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-3xl font-bold text-forest-600 mb-2">{statistics?.yearly?.length || 0}</p>
            <p className="text-gray-600">Years Active</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-3xl font-bold text-forest-600 mb-2">{statistics?.byPaymentMethod?.length || 0}</p>
            <p className="text-gray-600">Payment Methods</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Monthly Donations</h2>
            <div className="h-80"><Bar data={monthlyData} options={chartOptions} /></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Donations by Payment Method</h2>
            <div className="h-80"><Doughnut data={pieData} options={pieOptions} /></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Yearly Donations</h2>
            <div className="h-64"><Bar data={yearlyData} options={chartOptions} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
