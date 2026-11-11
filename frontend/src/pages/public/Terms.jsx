import React from 'react';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const Terms = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3">
        <IndianOrnament className="w-6 h-6 text-gold-600 mx-auto" />
        <h1 className="text-3xl font-serif font-bold text-maroon-900">Terms & Consultation Agreement</h1>
        <p className="text-xs text-stone-500">Effective Date: November 2026</p>
        <VedicDivider />
      </div>

      <div className="bg-white rounded-2xl p-8 border border-stone-200 text-stone-700 space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">1. Nature of Astrological Advice</h2>
          <p>
            Vedic Astrology is an interpretive, advisory science providing guidance based on ancient mathematical and scriptural principles. Consultations should be viewed as spiritual, ethical, and personal guidance, not as a replacement for certified medical, psychiatric, financial, or legal counsel.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">2. Consultation Duration Management</h2>
          <p>
            Consultation time is billed on a per-minute basis according to your chosen duration (10, 15, 20, 30, 45, or 60 minutes). A live timer is displayed on your dashboard during scheduled sessions. Both the client and the astrologer agree to respect the scheduled duration so subsequent bookings remain on time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">3. Manual UPI Verification & Fraud Prevention</h2>
          <p>
            Payment is executed directly via UPI QR code. A booking is considered verified only when the astrologer manually confirms the receipt of matching funds in their bank account. Submitting falsified transaction screenshots will result in immediate termination of account access and cancellation of bookings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-maroon-900">4. Cancellations and Rescheduling</h2>
          <p>
            Clients may cancel unpaid or unverified bookings at any time. For scheduled consultations, rescheduling requests must be coordinated at least 2 hours prior to the session start time.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
