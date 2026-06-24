import { Link } from 'react-router-dom';
import { Heart, BarChart3, Users, Leaf, ArrowRight, Sparkles, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { donationsAPI, orangutansAPI, articlesAPI } from '../utils/api';
import news1 from '../assets/news1.jpg';
import news2 from '../assets/news2.jpg';
import news3 from '../assets/news3.jpg';
import missionImage from '../assets/orangutans.jpg';

export default function Home() {
  const [stats, setStats] = useState({ total: 0, count: 0 });
  const [orangutanCount, setOrangutanCount] = useState(0);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsData, orangutans, articles] = await Promise.all([
        donationsAPI.getStatistics(),
        orangutansAPI.getAll(),
        articlesAPI.getAll(),
      ]);
      setStats(statsData.total);
      setOrangutanCount(orangutans.length);
      setRecentArticles(articles.slice(0, 3));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.pexels.com/photos/162240/orangutan-ape-animal-nature-162240.jpeg?auto=compress&cs=tinysrgb&w=1920')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-600/80 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Conservation Center</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">Orangutan Haven</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            A safe sanctuary for orangutans who cannot return to the wild. Every donation helps provide food, medical care, and a loving home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orangutans" className="inline-flex items-center gap-2 px-8 py-4 bg-forest-600 text-white font-semibold rounded-xl hover:bg-forest-700 transform hover:scale-105 transition-all">
              Meet Our Orangutans <ArrowRight className="w-5 h-5" />
            </Link>
            {stats.count > 0 && (
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20">
                <Heart className="w-5 h-5" /> Donate Now
              </Link>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-forest-600" />
              </div>
              <p className="text-4xl font-bold text-forest-700 mb-2">{orangutanCount}</p>
              <p className="text-gray-600">Orangutans Protected</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-earth-600" />
              </div>
              <p className="text-4xl font-bold text-earth-700 mb-2">{loading ? '...' : formatCurrency(stats.total)}</p>
              <p className="text-gray-600">Total Donations</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-700 mb-2">{stats.count}</p>
              <p className="text-gray-600">Donations Made</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-forest-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-100 rounded-full mb-4">
                <Leaf className="w-4 h-4 text-forest-600" />
                <span className="text-sm font-medium text-forest-700">Our Mission</span>
              </div>
              <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">Protecting Endangered Orangutans</h2>
              <p className="text-gray-600 text-lg mb-6">
                Orangutan Haven is a conservation center dedicated to providing a safe and caring environment for orangutans that cannot return to the wild.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-forest-700 font-semibold hover:text-forest-800">
                Learn more about our work <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <img src={missionImage}
                alt="Orangutan" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-4xl font-bold text-gray-900">Latest News</h2>
              <p className="text-gray-600 mt-2">Stay updated with our conservation efforts</p>
            </div>
            <Link to="/news" className="hidden sm:inline-flex items-center gap-2 text-forest-700 font-semibold hover:text-forest-800">
              View all <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-8 text-gray-500">Loading news...</div>
            ) : recentArticles.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">No articles available yet</div>
            ) : (
              recentArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        article.id === 1
                          ? news1
                          : article.id === 2
                          ? news2
                          : news3
                      }
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-forest-600 bg-forest-100 px-2 py-1 rounded">{article.category || 'General'}</span>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mt-3 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.content}</p>
                    <Link to={`/news/${article.id}`} className="inline-flex items-center gap-1 text-forest-700 text-sm font-medium mt-4 hover:text-forest-800">
                      Read more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-forest-800 to-forest-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Help Us Make a Difference</h2>
            <p className="text-forest-100 max-w-2xl mx-auto mb-8">
              Your support provides food, medical care, and a safe home for our orangutans.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-800 font-semibold rounded-xl hover:bg-forest-100">
              <Heart className="w-5 h-5" /> Start Donating
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
