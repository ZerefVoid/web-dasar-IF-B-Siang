import { Heart, Shield, Users, Leaf } from 'lucide-react';
import story1 from '../assets/ourstory1.jpg';
import story2 from '../assets/ourstory2.jpg';
import story3 from '../assets/ourstory3.jpg';
import story4 from '../assets/ourstory4.jpg';

export default function About() {
  const values = [
    { icon: Heart, title: 'Compassion', description: 'We treat every orangutan with kindness and respect, ensuring their well-being is our top priority.' },
    { icon: Shield, title: 'Protection', description: 'We provide a safe sanctuary where orangutans can live free from threats and harm.' },
    { icon: Users, title: 'Community', description: 'We engage local communities and supporters worldwide in our conservation mission.' },
    { icon: Leaf, title: 'Sustainability', description: 'We practice sustainable operations and promote environmental stewardship.' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-24 bg-gradient-to-br from-forest-800 to-forest-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">About Orangutan Haven</h1>
          <p className="text-xl md:text-2xl text-forest-100 max-w-3xl mx-auto">
            Dedicated to protecting and caring for orangutans who cannot return to the wild
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg mb-4">
                Orangutan Haven was established with a single mission: to provide a safe haven for orangutans that cannot be returned to their natural habitat.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Located in North Sumatra, Indonesia, our sanctuary is home to orangutans like Krismon, who spent 19 years as an illegal pet, and Lewis, who lost his sight after being shot multiple times during a human-wildlife conflict.
              </p>
              <p className="text-gray-600 text-lg">
                With your generous donations, we can continue to provide these beautiful beings with the care, dignity, and quality of life they deserve.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={story1} alt="Story" className="rounded-xl shadow-lg" />
              <img src={story2} alt="Story" className="rounded-xl shadow-lg mt-8" />
              <img src={story3} alt="Story" className="rounded-xl shadow-lg" />
              <img src={story4} alt="Story" className="rounded-xl shadow-lg mt-8" />
          </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-forest-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-forest-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
