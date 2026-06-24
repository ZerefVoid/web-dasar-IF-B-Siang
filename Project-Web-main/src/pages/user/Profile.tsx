import { useEffect, useState } from 'react';
import { User, Mail, Award, Lock, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../utils/api';

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ full_name: '', profile_picture: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getProfile();
      setProfile({ full_name: data.full_name || '', profile_picture: data.profile_picture || '' });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await usersAPI.updateProfile(profile);
      await refreshUser();
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setPasswordSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError('New password must be at least 6 characters');
      setSaving(false);
      return;
    }

    try {
      await usersAPI.changePassword({ current_password: passwordData.current_password, new_password: passwordData.new_password });
      setPasswordSuccess('Password changed successfully');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-forest-400" />
              )}
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-1">{profile.full_name}</h2>
            <p className="text-gray-600 text-sm mb-3">{user?.email}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyles(user?.badge || 'Friend of Orangutans')}`}>
              <div className="flex items-center gap-1"><Award className="w-3 h-3" />{user?.badge || 'Friend of Orangutans'}</div>
            </span>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-forest-600" />
              <h2 className="font-display text-xl font-bold text-gray-900">Profile Information</h2>
            </div>

            {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}
            {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={user?.email || ''} disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                <input type="url" value={profile.profile_picture}
                  onChange={(e) => setProfile({ ...profile, profile_picture: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                  placeholder="https://example.com/your-photo.jpg" />
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-forest-600 text-white font-semibold rounded-lg hover:bg-forest-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-forest-600" />
            <h2 className="font-display text-xl font-bold text-gray-900">Change Password</h2>
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {passwordSuccess}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input type="password" required value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input type="password" required value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input type="password" required value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500" />
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 disabled:opacity-50">
              <Lock className="w-4 h-4" /> {saving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
