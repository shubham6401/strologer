import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PaymentStatusBadge, BookingStatusBadge } from '../../components/StatusBadge';
import ConsultationTimer from '../../components/ConsultationTimer';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.warn('Failed to load customer bookings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 mt-2">Loading your consultations...</p>
      </div>
    );
  }

  // Next scheduled consultation
  const nextConsultation = bookings.find(
    (b) => b.bookingStatus === 'SCHEDULED' && b.scheduledStartTime && new Date(b.scheduledEndTime) > new Date()
  );

  // Pending payments (either created without screenshot or payment rejected)
  const pendingPayments = bookings.filter(
    (b) => b.paymentStatus === 'PAYMENT_PENDING' || b.paymentStatus === 'PAYMENT_REJECTED'
  );

  const completedCount = bookings.filter((b) => b.bookingStatus === 'COMPLETED').length;
  const underVerificationCount = bookings.filter(
    (b) => b.paymentStatus === 'UNDER_VERIFICATION' || b.paymentStatus === 'SCREENSHOT_SUBMITTED'
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Banner for Pending Payment or Rejection */}
      {pendingPayments.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-950 text-sm">
                You have {pendingPayments.length} booking(s) awaiting payment completion
              </h4>
              <p className="text-xs text-amber-800">
                Please scan the astrologer's UPI QR and upload your transaction receipt.
              </p>
            </div>
          </div>
          <Link
            to={`/payment/${pendingPayments[0]._id}`}
            className="px-4 py-2 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            Complete Payment Proof →
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Upcoming Sessions</span>
            <Video className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">
            {nextConsultation ? '1 Active' : '0 Scheduled'}
          </div>
          <span className="text-[11px] text-purple-700 font-medium mt-1 block">
            {nextConsultation ? 'Ready for Zoom call' : 'No upcoming calls'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Pending Payments</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700">
            {pendingPayments.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Awaiting your screenshot upload
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Under Verification</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-blue-700">
            {underVerificationCount}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Astrologer verifying bank statement
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">
            {completedCount}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Total historical sessions
          </span>
        </div>
      </div>

      {/* Immediate Next Scheduled Consultation Banner */}
      {nextConsultation && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-maroon-900">
              Next Upcoming Video Consultation
            </h3>
            <span className="text-xs text-stone-600">
              Astrologer: <strong>{nextConsultation.executiveId?.name}</strong>
            </span>
          </div>

          <ConsultationTimer
            scheduledStartTime={nextConsultation.scheduledStartTime}
            scheduledEndTime={nextConsultation.scheduledEndTime}
            durationMinutes={nextConsultation.selectedDuration}
            zoomMeetingUrl={nextConsultation.zoomMeetingUrl}
            zoomPasscode={nextConsultation.zoomPasscode}
            isExecutive={false}
          />
        </div>
      )}

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-maroon-900">
              My Consultations
            </h3>
            <p className="text-xs text-stone-500">
              Your recent astrology consultation bookings and payment status.
            </p>
          </div>
          <Link
            to="/astrologers"
            className="px-3.5 py-1.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book New Consultation</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Astrologer</th>
                <th className="px-5 py-3">Topic & Duration</th>
                <th className="px-5 py-3">Payable Fee</th>
                <th className="px-5 py-3">Payment Status</th>
                <th className="px-5 py-3">Booking Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-stone-500">
                    <p className="mb-3">You have not booked any consultations yet.</p>
                    <Link
                      to="/astrologers"
                      className="inline-block px-4 py-2 rounded-lg bg-maroon-700 text-white font-semibold text-xs"
                    >
                      Browse Certified Astrologers
                    </Link>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-maroon-900">
                      {b.bookingId}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-stone-900">
                        {b.executiveId?.name || 'Astrologer'}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {b.executiveProfile?.title || 'Acharya'}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-medium text-stone-800">{b.consultationTopic}</div>
                      <div className="text-[11px] text-stone-500">{b.selectedDuration} minutes</div>
                    </td>

                    <td className="px-5 py-3.5 font-serif font-bold text-maroon-900 text-sm">
                      ₹{b.totalAmount}
                    </td>

                    <td className="px-5 py-3.5">
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </td>

                    <td className="px-5 py-3.5">
                      <BookingStatusBadge status={b.bookingStatus} />
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      {b.paymentStatus === 'PAYMENT_PENDING' || b.paymentStatus === 'PAYMENT_REJECTED' ? (
                        <Link
                          to={`/payment/${b._id}`}
                          className="px-3 py-1.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs shadow-xs"
                        >
                          Pay Now
                        </Link>
                      ) : (
                        <Link
                          to={`/payment/${b._id}`}
                          className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium text-xs"
                        >
                          Status
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
