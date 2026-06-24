import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import { articlesAPI } from '../utils/api';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadArticle(); }, [id]);

  const loadArticle = async () => {
    try {
      const data = await articlesAPI.getOne(Number(id));
      setArticle(data);
    } catch (error) {
      console.error('Error loading article:', error);
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
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link to="/news" className="text-forest-600 hover:text-forest-700 font-medium">Back to News</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <article className="max-w-4xl mx-auto">
        <Link to="/news" className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <header className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-forest-600 bg-forest-100 px-3 py-1 rounded-full">{article.category || 'General'}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" /> {formatDate(article.created_at)}
            </div>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">{article.title}</h1>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {article.thumbnail && (
            <img src={article.thumbnail} alt={article.title} className="w-full h-64 object-cover rounded-xl mb-8" />
          )}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">Published on {formatDate(article.created_at)}</div>
            <button className="flex items-center gap-2 text-gray-500 hover:text-forest-600">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
