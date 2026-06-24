import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Menu, X, Home, Info, BarChart3, Newspaper, Heart, Phone, HelpCircle,
  LogIn, UserPlus, LayoutDashboard, Shield, LogOut
} from 'lucide-react';

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Statistics', path: '/statistics', icon: BarChart3 },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Our Orangutans', path: '/orangutans', icon: Heart },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-forest-600 to-forest-800 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-forest-800">Orangutan Haven</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-forest-100 text-forest-700' : 'text-gray-600 hover:bg-forest-50 hover:text-forest-700'}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-forest-700 text-white rounded-lg hover:bg-forest-800">
                      <Shield className="w-4 h-4" /> Admin Panel
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-forest-700 hover:bg-forest-50 rounded-lg">
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                  <Link to="/register" className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700">
                    <UserPlus className="w-4 h-4" /> Register
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${location.pathname === link.path ? 'bg-forest-100 text-forest-700' : 'text-gray-600 hover:bg-forest-50'}`}>
                  <link.icon className="w-5 h-5" /> {link.name}
                </Link>
              ))}
              <hr className="my-3" />
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-forest-700 text-white rounded-lg">
                      <Shield className="w-5 h-5" /> Admin Panel
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-forest-600 text-white rounded-lg">
                      <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-forest-700 hover:bg-forest-50 rounded-lg">
                    <LogIn className="w-5 h-5" /> Login
                  </Link>
                  <Link to="/register" className="flex items-center gap-3 px-4 py-3 bg-forest-600 text-white rounded-lg">
                    <UserPlus className="w-5 h-5" /> Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20"><Outlet /></main>

      <footer className="bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="font-display text-xl font-bold">Orangutan Haven</span>
              </div>
              <p className="text-forest-200 max-w-md">
                A conservation center providing a safe haven for orangutans that cannot return to the wild.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-forest-200 hover:text-white">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Account</h4>
              <ul className="space-y-2">
                {user ? (
                  <>
                    <li><Link to="/dashboard" className="text-forest-200 hover:text-white">Dashboard</Link></li>
                    <li><button onClick={handleLogout} className="text-forest-200 hover:text-white">Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="text-forest-200 hover:text-white">Login</Link></li>
                    <li><Link to="/register" className="text-forest-200 hover:text-white">Register</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-forest-700 mt-8 pt-8 text-center text-forest-300">
            <p>&copy; 2024 Orangutan Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
