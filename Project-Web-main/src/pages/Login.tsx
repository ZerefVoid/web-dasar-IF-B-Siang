import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Heart, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');

  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAdmin) {
        await adminLogin(username, password);
        navigate('/admin');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-forest-600 to-forest-800 rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-forest-800">Orangutan Haven</span>
          </Link>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!isAdmin ? 'bg-white text-forest-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            User Login
          </button>
          <button onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${isAdmin ? 'bg-white text-forest-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            Admin Login
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">{isAdmin ? 'Admin Login' : 'Welcome Back'}</h2>
          <p className="text-gray-600 mb-6">{isAdmin ? 'Sign in to access the admin dashboard' : 'Sign in to continue supporting orangutans'}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            {isAdmin ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" required value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="Admin username" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="your@email.com" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                  placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-forest-600 text-white font-semibold rounded-lg hover:bg-forest-700 disabled:opacity-50">
              {loading ? 'Signing in...' : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>

          {!isAdmin && (
            <p className="mt-6 text-center text-gray-600">
              Don't have an account? <Link to="/register" className="text-forest-600 font-medium hover:text-forest-700">Register here</Link>
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
