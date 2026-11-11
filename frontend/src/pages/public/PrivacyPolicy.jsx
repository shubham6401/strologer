import React from 'react';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const PrivacyPolicy = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3">
        <IndianOrnament className="w-6 h-6 text-gold-600 mx-auto" />
        <h1 className="text-3xl font-serif font-bold text-maroon-900">Privacy & Confidentiality Policy</h1>
        <p className="text-xs text-stone-500">Effective Date: November 2026</p>
        <VedicDivider />
      </div>

      <div className="bg-white rounded-2xl p-8 border border-stone-200 text-stone-700 space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">1. Sacred Confidentiality of Astrological Data</h2>
          <p>
            At Jyotishya Vani, we treat your birth details (date of birth, time of birth, and place of birth) as sacred personal data. We never sell, rent, or monetize birth chart data. Your birth details are utilized exclusively to calculate planetary positions and divisional charts (Kundli) for your authorized consultation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">2. Payment Screenshots & Transaction Data</h2>
          <p>
            When you submit a payment screenshot or transaction reference number (UTR), this file is stored securely and accessible only to your assigned astrologer for manual bank statement verification. Screenshots are encrypted in storage and never displayed publicly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">3. Video Consultations (Zoom)</h2>
          <p>
            Zoom video consultations are end-to-end encrypted. Meeting links, IDs, and passcodes are accessible solely to the customer who booked the session and the selected executive astrologer. Neither party may record the consultation without mutual explicit consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">4. Account Security</h2>
          <p>
            User passwords are encrypted with bcrypt cryptographic salting. We enforce strict role-based access control to prevent cross-account data leakage.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
