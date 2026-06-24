import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Heart, LogOut, Menu, X, Users, Newspaper, DollarSign, HelpCircle, Mail, Smile
} from 'lucide-react';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orangutans', path: '/admin/orangutans', icon: Smile },
    { name: 'Articles', path: '/admin/articles', icon: Newspaper },
    { name: 'Donations', path: '/admin/donations', icon: DollarSign },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Contacts', path: '/admin/contacts', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-forest-900 text-white transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <Link to="/admin" className="flex items-center gap-2 px-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display text-lg font-bold">Orangutan Haven</span>
              <p className="text-xs text-forest-300">Admin Panel</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-forest-700 text-white' : 'text-forest-200 hover:bg-forest-800 hover:text-white'}`}>
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-forest-700">
            <Link to="/" className="flex items-center gap-3 px-3 py-3 text-forest-300 hover:text-white rounded-lg">
              <Heart className="w-5 h-5" /> Back to Website
            </Link>
          </div>

          <div className="mt-4 p-3 bg-forest-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-forest-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{user?.username || 'Admin'}</p>
                <p className="text-xs text-forest-300">Administrator</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-forest-300 hover:text-white hover:bg-forest-700 rounded-lg">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-gray-600 hover:text-gray-900">
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.name || 'Admin'}
            </h1>
            <span className="text-sm text-gray-500">Welcome, {user?.username || 'Admin'}</span>
          </div>
        </header>

        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}

export default AdminLayout;
