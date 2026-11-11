import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, ShieldCheck, HeartHandshake, BookOpen, Star } from 'lucide-react';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const About = () => {
  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-gold-700 uppercase tracking-widest">
          <IndianOrnament className="w-4 h-4 text-gold-600" />
          <span>Our Sacred Philosophy & Lineage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-maroon-900 tracking-tight">
          Preserving the Authentic Sanctity of Vedic Astrology
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Jyotishya Vani was founded with a singular devotion: to rescue the noble science of Vedic Astrology from fear-based commercialism and restore its original stature as an illuminating, compassionate guide for modern seekers.
        </p>
        <VedicDivider />
      </div>

      {/* Main Philosophy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-maroon-900">
            Vedanga Jyotisha: The Eye of Cosmic Consciousness
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            Astrology in ancient India was never intended as a tool of anxiety or fortune-telling. As the sixth limb of the Vedas (<em>Chakshu</em> - the eye), Jyotish reveals the subtle karmic tides influencing your mind, relationships, and worldly endeavors.
          </p>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            Our platform operates under an uncompromising ethical pledge:
          </p>
          <ul className="space-y-3 text-sm text-stone-800">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-600 mt-2 flex-shrink-0" />
              <span><strong>Zero Fear-Mongering:</strong> We strictly forbid the exploitation of doshas (such as Manglik, Kaal Sarp, or Sade Sati) to terrify seekers into expensive pujas.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-600 mt-2 flex-shrink-0" />
              <span><strong>Transparent Per-Minute Billing:</strong> You choose the exact duration you need and pay only for that time directly to the astrologer’s verified UPI QR.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-600 mt-2 flex-shrink-0" />
              <span><strong>Pragmatic Remedies:</strong> Our astrologers emphasize practical karma correction, meditation, and classical Vedic mantras.</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gold-300 bg-white p-2">
            <img
              src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80"
              alt="Vedic Sanskrit Scriptures"
              className="w-full h-80 object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="pt-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl font-serif font-bold text-maroon-900">
            Our Four Pillars of Consultation
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Academic Lineage',
              desc: 'Every consultant holds degrees from respected Vedic universities with at least 10+ years of active chart analysis.',
              icon: Award,
            },
            {
              title: 'Total Confidentiality',
              desc: 'Your date of birth, personal queries, and video consultations are strictly confidential between you and your astrologer.',
              icon: ShieldCheck,
            },
            {
              title: 'Manual UPI Security',
              desc: 'Direct payment to the astrologer’s personal UPI QR code with human verification eliminates intermediary payment failures.',
              icon: HeartHandshake,
            },
            {
              title: 'Interactive Zoom Video',
              desc: 'Face-to-face dialogue where you can ask real-time questions, see your birth chart on screen, and seek remedies.',
              icon: BookOpen,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs hover:border-gold-400 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-ivory-200 text-maroon-800 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold-600" />
                </div>
                <h4 className="font-serif font-bold text-base text-maroon-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-ivory-200/80 rounded-2xl p-8 border border-gold-300 text-center space-y-4">
        <h3 className="text-2xl font-serif font-bold text-maroon-900">
          Begin Your Consultative Journey Today
        </h3>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Explore our directory of verified Acharyas and select the right guide for your life questions.
        </p>
        <Link
          to="/astrologers"
          className="inline-block px-7 py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          Explore Astrologers
        </Link>
      </div>
    </div>
  );
};

export default About;
