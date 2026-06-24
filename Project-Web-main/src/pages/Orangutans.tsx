import krismonImage from '../assets/krismon.jpg';
import leuserImage from '../assets/Leuser.jpeg';
import DekNongImage from '../assets/Dek Nong.jpeg';
import fahzrenImage from '../assets/Fahzren.jpeg';
import lewisImage from '../assets/Lewis.jpeg';
import dinaImage from '../assets/Dina.jpeg';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, ArrowRight } from 'lucide-react';
import { orangutansAPI } from '../utils/api';


export default function Orangutans() {
  const [orangutans, setOrangutans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrangutans(); }, []);

  const loadOrangutans = async () => {
    try {
      const data = await orangutansAPI.getAll();
      setOrangutans(data);
    } catch (error) {
      console.error('Error loading orangutans:', error);
    } finally {
      setLoading(false);
    }
  };

const getOrangutanImage = (name: string) => {
  const imageMap: Record<string, string> = {
    "Krismon": krismonImage,
    "Dina": dinaImage,
    "Lewis": lewisImage,
    "Leuser": leuserImage,
    "Fahzren": fahzrenImage,
    "Dek Nong": DekNongImage
  };

  return imageMap[name] || krismonImage;
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our orangutans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Meet Our Orangutans</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each of our residents has a unique story. Learn about their journeys and how they found a safe home at Orangutan Haven.
          </p>
        </div>

        {orangutans.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-forest-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orangutans listed yet</h3>
            <p className="text-gray-600">Check back soon to meet our residents!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orangutans.map((orangutan) => (
              <Link key={orangutan.id} to={`/orangutans/${orangutan.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-64 overflow-hidden">
                  <img src={getOrangutanImage(orangutan.name)} alt={orangutan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display text-2xl font-bold text-gray-900">{orangutan.name}</h2>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${orangutan.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {orangutan.gender}
                    </span>
                  </div>
                  {orangutan.age && (
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{orangutan.age} years old</span></div>
                    </div>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{orangutan.description}</p>
                  <div className="flex items-center text-forest-600 font-medium group-hover:text-forest-700">
                    Read their story <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
