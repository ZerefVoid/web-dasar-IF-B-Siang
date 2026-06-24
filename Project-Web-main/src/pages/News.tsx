import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Newspaper } from 'lucide-react';
import { articlesAPI } from '../utils/api';
import news1 from '../assets/news1.jpg';
import news2 from '../assets/news2.jpg';
import news3 from '../assets/news3.jpg';

export default function News() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadArticles(); }, []);

  const loadArticles = async () => {
    try {
      const data = await articlesAPI.getAll();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay informed about conservation efforts, orangutan stories, and community events</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      article.title.includes('Mengenal Orangutan Sumatera')
                        ? news1
                        : article.title.includes('Ancaman Terhadap Orangutan')
                        ? news2
                        : news3
                    }
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-forest-600 bg-forest-100 px-2 py-1 rounded">{article.category || 'General'}</span>
                    <span className="text-xs text-gray-500">{formatDate(article.created_at)}</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.content}</p>
                  <Link to={`/news/${article.id}`} className="inline-flex items-center gap-2 text-forest-600 font-medium hover:text-forest-700">
                    Read more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
