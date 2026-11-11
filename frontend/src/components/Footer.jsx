import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Phone, Mail, MapPin, Clock, ShieldCheck, Award } from 'lucide-react';
import { IndianOrnament } from './IndianOrnament';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-stone-300 border-t-2 border-gold-600/40">
      {/* Top highlights bar */}
      <div className="border-b border-charcoal-800 py-8 bg-charcoal-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-maroon-800/80 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base">Certified Vedic Scholars</h4>
              <p className="text-xs text-stone-400 mt-0.5">Rigorous verification of scholarly credentials & lineage.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-maroon-800/80 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base">100% Confidential Consultations</h4>
              <p className="text-xs text-stone-400 mt-0.5">Your birth data and personal discussions remain private.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-maroon-800/80 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base">Per-Minute Transparent Billing</h4>
              <p className="text-xs text-stone-400 mt-0.5">Pay only for your selected consultation duration.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & lineage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-maroon-800 text-gold-400 border border-gold-500/40 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Jyotishya Vani
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              An authentic digital sanctuary bridging timeless Vedic astrological wisdom with modern video consultations. Guided by certified Jyotish Acharyas through classical Parashari, Jaimini, and KP methodologies.
            </p>
            <div className="flex items-center gap-2 pt-2 text-gold-500 text-xs font-serif">
              <IndianOrnament className="w-4 h-4 text-gold-500" />
              <span>सत्यमेव जयते नानृतम् • Truth alone triumphs</span>
            </div>
          </div>

          {/* Column 2: Consultation Services */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 tracking-wide border-b border-gold-600/30 pb-2">
              Vedic Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-gold-400 transition-colors">Kundli Analysis</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-400 transition-colors">Career & Business</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-400 transition-colors">Marriage & Compatibility</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-400 transition-colors">Kundli Milan</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-400 transition-colors">Vastu Shastra</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-400 transition-colors">Gemstone Guidance</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 tracking-wide border-b border-gold-600/30 pb-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/astrologers" className="hover:text-gold-400 transition-colors">Verified Astrologers</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-gold-400 transition-colors">How Booking Works</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold-400 transition-colors">Client Login</Link>
              </li>
              <li>
                <Link to="/executive/login" className="hover:text-gold-400 transition-colors">Astrologer Executive Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 tracking-wide border-b border-gold-600/30 pb-2">
              Consultation Desk
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span>Kashi Vedic Kendra, Assi Ghat Road, Varanasi, UP 221005</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>support@jyotishyavani.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span>Daily: 09:00 AM – 08:30 PM (IST)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal */}
        <div className="mt-12 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Jyotishya Vani. All rights reserved. Designed for authentic spiritual consultation.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-stone-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/how-it-works" className="hover:text-stone-300 transition-colors">
              Payment & Verification Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
