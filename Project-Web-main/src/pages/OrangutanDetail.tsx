import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Heart } from 'lucide-react';
import { orangutansAPI } from '../utils/api';
import krismonImage from '../assets/krismon.jpg';
import leuserImage from '../assets/Leuser.jpeg';
import DekNongImage from '../assets/Dek Nong.jpeg';
import fahzrenImage from '../assets/Fahzren.jpeg';
import lewisImage from '../assets/Lewis.jpeg';
import dinaImage from '../assets/Dina.jpeg';

export default function OrangutanDetail() {
  const { id } = useParams();
  const [orangutan, setOrangutan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrangutan(); }, [id]);

  const loadOrangutan = async () => {
    try {
      const data = await orangutansAPI.getOne(Number(id));
      setOrangutan(data);
    } catch (error) {
      console.error('Error loading orangutan:', error);
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!orangutan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Orangutan not found</h1>
          <Link to="/orangutans" className="text-forest-600 hover:text-forest-700 font-medium">Back to Orangutans</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/orangutans" className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Orangutans
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-80 overflow-hidden">
            <img src={getOrangutanImage(orangutan.name)} alt={orangutan.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">{orangutan.name}</h1>
                <span className={`inline-flex text-sm font-medium px-3 py-1 rounded-full ${orangutan.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {orangutan.gender}
                </span>
              </div>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700">
                <Heart className="w-5 h-5" /> Support {orangutan.name}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {orangutan.age && (
                <div className="bg-forest-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-forest-600 mb-1"><Calendar className="w-4 h-4" /> Age</div>
                  <p className="text-2xl font-bold text-gray-900">{orangutan.age} years</p>
                </div>
              )}
              {orangutan.birth_year && (
                <div className="bg-earth-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-earth-600 mb-1"><Calendar className="w-4 h-4" /> Birth Year</div>
                  <p className="text-2xl font-bold text-gray-900">{orangutan.birth_year}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-600 mb-1">Status</div>
                <p className="text-lg font-bold text-gray-900">Sanctuary Resident</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Story</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{orangutan.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-forest-700 to-forest-600 rounded-2xl p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-3">Help {orangutan.name} and friends</h2>
          <p className="text-forest-100 mb-6 max-w-xl mx-auto">Your donation provides food, medical care, and enrichment activities for all our orangutans.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest-700 font-semibold rounded-xl hover:bg-forest-50">
            <Heart className="w-5 h-5" /> Make a Donation
          </Link>
        </div>
      </div>
    </div>
  );
}
