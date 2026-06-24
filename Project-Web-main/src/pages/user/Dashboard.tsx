import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, DollarSign, Clock, TrendingUp, Award, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { donationsAPI, orangutansAPI } from '../../utils/api';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [orangutanCount, setOrangutanCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsData, orangutans] = await Promise.all([
        donationsAPI.getMyStats(),
        orangutansAPI.getAll(),
      ]);
      setStats(statsData);
      setOrangutanCount(orangutans.length);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case 'Rainforest Guardian': return 'badge-guardian';
      case 'Orangutan Protector': return 'badge-protector';
      default: return 'badge-friend';
    }
  };

  const getNextBadge = (currentBadge: string) => {
    switch (currentBadge) {
      case 'Friend of Orangutans': return { name: 'Orangutan Protector', amount: 500000 };
      case 'Orangutan Protector': return { name: 'Rainforest Guardian', amount: 1000000 };
      default: return null;
    }
  };

  const nextBadge = user?.badge ? getNextBadge(user.badge) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-forest-700 to-forest-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Donor'}!</h1>
              <p className="text-forest-100">Your support helps care for {orangutanCount} orangutans.</p>
            </div>
            <Link to="/dashboard/donations" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest-700 font-semibold rounded-xl hover:bg-forest-50">
              <Heart className="w-5 h-5" /> Make a Donation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-forest-600" />
              <span className="text-xs font-medium text-forest-600 bg-forest-100 px-2 py-1 rounded">Total Donated</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : formatCurrency(stats?.total_amount || 0)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">Donations</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_donations || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Badge</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{user?.badge || 'Friend of Orangutans'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Last Donation</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{stats?.last_donation ? formatDate(stats.last_donation) : 'No donations yet'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="font-display text-xl font-bold text-gray-900">Your Badge Progress</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getBadgeStyles(user?.badge || 'Friend of Orangutans')}`}>
              {user?.badge || 'Friend of Orangutans'}
            </span>
          </div>

          {nextBadge ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress to {nextBadge.name}</span>
                <span className="text-sm font-medium text-forest-600">{formatCurrency(stats?.total_amount || 0)} / {formatCurrency(nextBadge.amount)}</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-forest-600 to-forest-500 rounded-full transition-all"
                  style={{ width: `${Math.min(((stats?.total_amount || 0) / nextBadge.amount) * 100, 100)}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Donate {formatCurrency(nextBadge.amount - (stats?.total_amount || 0))} more to earn {nextBadge.name} badge!
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-forest-600 font-semibold">Congratulations! You've reached the highest badge level!</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/dashboard/donations" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center group-hover:bg-forest-200">
                <Heart className="w-6 h-6 text-forest-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Make Donation</h3>
                <p className="text-sm text-gray-500">Support our orangutans</p>
              </div>
            </div>
          </Link>
          <Link to="/dashboard/profile" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center group-hover:bg-earth-200">
                <TrendingUp className="w-6 h-6 text-earth-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Edit Profile</h3>
                <p className="text-sm text-gray-500">Update your information</p>
              </div>
            </div>
          </Link>
          <Link to="/orangutans" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Meet Orangutans</h3>
                <p className="text-sm text-gray-500">Learn their stories</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
