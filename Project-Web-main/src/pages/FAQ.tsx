import { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { faqsAPI } from '../utils/api';

export default function FAQ() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => { loadFAQs(); }, []);

  const loadFAQs = async () => {
    try {
      const data = await faqsAPI.getAll();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FAQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-forest-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about Orangutan Haven</p>
        </div>

        {faqs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">No FAQs available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {openId === faq.id && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-forest-700 to-forest-600 rounded-2xl p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-forest-100 mb-6">Can't find what you're looking for? Feel free to contact us directly.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest-700 font-semibold rounded-lg hover:bg-forest-50">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
