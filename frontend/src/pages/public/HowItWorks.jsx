import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Clock,
  QrCode,
  UploadCloud,
  CheckCircle2,
  Video,
  AlertCircle,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Select Your Astrologer',
      desc: 'Browse our directory of certified Jyotish Acharyas. Review their years of experience, classical qualifications, specializations, and per-minute fee.',
      icon: Compass,
      detail: 'Choose an astrologer whose specialization matches your needs—whether Kundli analysis, career transitions, marriage compatibility, or Vastu guidance.',
    },
    {
      num: '02',
      title: 'Choose Consultation Duration',
      desc: 'Pick how long you wish to consult: 10, 15, 20, 30, 45, or 60 minutes. The system calculates the exact total amount in real time.',
      icon: Clock,
      detail: 'Price = Selected Duration in Minutes × Astrologer’s Per-Minute Fee. No hidden platform commissions or surprise deductions.',
    },
    {
      num: '03',
      title: 'Scan Astrologer’s Personal UPI QR',
      desc: 'On the booking payment page, the personal UPI QR code and UPI ID belonging to your selected astrologer will be presented.',
      icon: QrCode,
      detail: 'Open any standard UPI app (Google Pay, PhonePe, Paytm, BHIM) and complete the exact payment to the astrologer’s verified account.',
    },
    {
      num: '04',
      title: 'Upload Payment Screenshot',
      desc: 'Take a clear screenshot of the completed transaction from your UPI app showing the 12-digit UTR / Reference Number.',
      icon: UploadCloud,
      detail: 'Upload the screenshot (JPG/PNG format) on the payment portal. Your booking status updates to "Under Verification".',
    },
    {
      num: '05',
      title: 'Astrologer Manually Verifies Payment',
      desc: 'The astrologer checks their personal bank / UPI statement to verify receipt of the transaction funds before approving.',
      icon: CheckCircle2,
      detail: 'We never automatically verify payments without human oversight. Once approved, the astrologer sets the Zoom consultation slot.',
    },
    {
      num: '06',
      title: 'Join Scheduled Zoom Consultation',
      desc: 'Your dashboard displays the scheduled time, live countdown timer, and secure Zoom room link with meeting passcode.',
      icon: Video,
      detail: 'The "Join Zoom Meeting" button activates 10 minutes prior to the start time. A live countdown tracks your consultation duration.',
    },
  ];

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-gold-700 uppercase tracking-widest">
          <IndianOrnament className="w-4 h-4 text-gold-600" />
          <span>Transparent Consultation Process</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-maroon-900 tracking-tight">
          How Booking & Consultation Works
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          A seamless, human-verified experience designed for complete transparency, direct astrologer payment, and punctual video sessions.
        </p>
        <VedicDivider />
      </div>

      {/* Step by Step Vertical Roadmap */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start gap-6 hover:border-gold-400 transition-colors"
            >
              <div className="flex sm:flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-ivory-200 text-maroon-800 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  <Icon className="w-7 h-7 text-gold-600" />
                </div>
                <span className="font-serif font-bold text-xl text-gold-700">
                  {s.num}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="font-serif font-bold text-xl text-maroon-900">
                  {s.title}
                </h3>
                <p className="text-sm text-stone-700 font-medium leading-relaxed">
                  {s.desc}
                </p>
                <div className="p-3 bg-ivory-100 rounded-lg border border-gold-200/60 text-xs text-stone-600 leading-relaxed">
                  {s.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Policy Box */}
      <div className="max-w-4xl mx-auto bg-ivory-200/90 rounded-2xl p-8 border border-gold-300 space-y-4">
        <div className="flex items-center gap-3 text-maroon-900">
          <Shield className="w-6 h-6 text-gold-600 flex-shrink-0" />
          <h3 className="font-serif font-bold text-lg">
            Consultation Time & Duration Guidelines
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Standard Zoom video meeting links do not automatically disconnect callers when the purchased duration ends. Therefore, both client and astrologer are provided with an active live session timer on their respective dashboards. Please ensure you prioritize your questions so the session completes within the purchased time frame and respects subsequent bookings.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/astrologers"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all"
        >
          <span>Find an Astrologer & Book Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
