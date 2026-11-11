import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Video,
  ArrowRight,
  Eye,
  BadgeIndianRupee,
  QrCode,
  Users,
} from 'lucide-react';
import api from '../../services/api';
import { PaymentStatusBadge, BookingStatusBadge } from '../../components/StatusBadge';
import ConsultationTimer from '../../components/ConsultationTimer';

const ExecutiveOverview = () => {
  const [earnings, setEarnings] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [earnRes, bookRes] = await Promise.all([
          api.get('/executive/earnings'),
          api.get('/executive/bookings'),
        ]);
        if (earnRes.data.success) setEarnings(earnRes.data.stats);
        if (bookRes.data.success) setBookings(bookRes.data.bookings);
      } catch (err) {
        console.warn('[Executive Overview Fetch Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-9 h-9 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-serif text-maroon-900 mt-3">Loading executive metrics...</p>
      </div>
    );
  }

  // Find upcoming scheduled consultation
  const nextScheduled = bookings.find(
    (b) => b.bookingStatus === 'SCHEDULED' && b.scheduledStartTime && new Date(b.scheduledEndTime) > new Date()
  );

  const pendingVerificationCount = bookings.filter(
    (b) => b.paymentStatus === 'UNDER_VERIFICATION' || b.paymentStatus === 'SCREENSHOT_SUBMITTED'
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Banner if pending verifications exist */}
      {pendingVerificationCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">
                {pendingVerificationCount} Customer Payment Screenshot(s) Awaiting Your Verification
              </h4>
              <p className="text-xs text-amber-700">
                Customers have uploaded UPI transaction proofs. Verify receipt in your bank app to enable Zoom scheduling.
              </p>
            </div>
          </div>
          <Link
            to="/executive/payment-verification"
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <span>Verify Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
            <span>Verified Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-maroon-900">
            ₹{earnings?.totalVerifiedGross || 0}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Net: ₹{earnings?.netEarnings || 0} (After 10% platform facilitation)
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
            <span>Scheduled Sessions</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">
            {earnings?.scheduledCount || 0}
          </div>
          <span className="text-[11px] text-purple-700 font-medium mt-1 block">
            Active Video Appointments
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
            <span>Pending Verifications</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700">
            {earnings?.pendingVerificationCount || 0}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Value: ₹{earnings?.pendingValue || 0}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
            <span>Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">
            {earnings?.completedCount || 0}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Total Bookings: {earnings?.totalBookingsCount || 0}
          </span>
        </div>
      </div>

      {/* Immediate Next Scheduled Consultation Banner */}
      {nextScheduled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-maroon-900">
              Next Scheduled Video Consultation
            </h3>
            <span className="text-xs text-stone-500">
              Client: {nextScheduled.customerId?.name} ({nextScheduled.customerId?.phone})
            </span>
          </div>
          <ConsultationTimer
            scheduledStartTime={nextScheduled.scheduledStartTime}
            scheduledEndTime={nextScheduled.scheduledEndTime}
            durationMinutes={nextScheduled.selectedDuration}
            zoomMeetingUrl={nextScheduled.zoomMeetingUrl}
            zoomPasscode={nextScheduled.zoomPasscode}
            isExecutive={true}
          />
        </div>
      )}

      {/* Recent Booking Requests Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-maroon-900">
              Recent Consultation Bookings
            </h3>
            <p className="text-xs text-stone-500">
              Latest consultation requests received across all topics.
            </p>
          </div>
          <Link
            to="/executive/booking-requests"
            className="text-xs font-semibold text-maroon-800 hover:text-maroon-950 flex items-center gap-1"
          >
            <span>View All Bookings ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Client Name</th>
                <th className="px-6 py-3">Topic & Duration</th>
                <th className="px-6 py-3">Fee Snapshot</th>
                <th className="px-6 py-3">Payment Status</th>
                <th className="px-6 py-3">Session Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-stone-500">
                    No booking requests received yet.
                  </td>
                </tr>
              ) : (
                bookings.slice(0, 6).map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-medium text-stone-900">
                      {b.bookingId}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-stone-900">{b.customerId?.name || 'Client'}</div>
                      <div className="text-[11px] text-stone-500">{b.customerId?.phone}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-stone-800">{b.consultationTopic}</div>
                      <div className="text-[11px] text-stone-500">{b.selectedDuration} minutes</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-serif font-bold text-maroon-900">₹{b.totalAmount}</span>
                      <span className="text-[10px] text-stone-400 block">(₹{b.pricePerMinuteSnapshot}/m)</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="px-6 py-3.5">
                      <BookingStatusBadge status={b.bookingStatus} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/executive/booking-requests?id=${b._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
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

export default ExecutiveOverview;
