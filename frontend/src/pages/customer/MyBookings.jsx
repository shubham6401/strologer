import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CreditCard, Video, Eye, XCircle, PlusCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { PaymentStatusBadge, BookingStatusBadge } from '../../components/StatusBadge';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.warn('Failed to load bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`, {
        reason: 'Cancelled by customer from portal.',
      });
      if (res.data.success) {
        await fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const filtered = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return b.paymentStatus === 'PAYMENT_PENDING' || b.paymentStatus === 'PAYMENT_REJECTED';
    if (activeTab === 'VERIFICATION') return b.paymentStatus === 'UNDER_VERIFICATION';
    if (activeTab === 'SCHEDULED') return b.bookingStatus === 'SCHEDULED';
    if (activeTab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-maroon-900">
            My Consultation Bookings
          </h2>
          <p className="text-xs text-stone-500">
            View booking status, upload payment screenshots, and access scheduled Zoom consultation links.
          </p>
        </div>

        <Link
          to="/astrologers"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Book New Consultation</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2 text-xs">
        {[
          { key: 'ALL', label: 'All Bookings' },
          { key: 'PENDING', label: 'Pending Payment' },
          { key: 'VERIFICATION', label: 'Under Verification' },
          { key: 'SCHEDULED', label: 'Scheduled Sessions' },
          { key: 'COMPLETED', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-maroon-700 text-white font-semibold shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Astrologer</th>
                <th className="px-5 py-3">Topic & Duration</th>
                <th className="px-5 py-3">Fee Snapshot</th>
                <th className="px-5 py-3">Payment Status</th>
                <th className="px-5 py-3">Booking Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-stone-500">
                    Loading your bookings...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-stone-500">
                    No bookings found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-maroon-900">
                      {b.bookingId}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-stone-900">
                        {b.executiveId?.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {b.executiveProfile?.title || 'Astrologer'}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-medium text-stone-800">{b.consultationTopic}</div>
                      <div className="text-[10px] text-stone-500">{b.selectedDuration} minutes</div>
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

                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/payment/${b._id}`}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium"
                      >
                        Details
                      </Link>

                      {(b.paymentStatus === 'PAYMENT_PENDING' || b.paymentStatus === 'PAYMENT_REJECTED') && (
                        <>
                          <Link
                            to={`/payment/${b._id}`}
                            className="px-3 py-1.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-semibold"
                          >
                            Pay Now
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(b._id)}
                            className="px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Cancel booking"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {b.bookingStatus === 'SCHEDULED' && (
                        <Link
                          to={`/payment/${b._id}`}
                          className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold"
                        >
                          Join Meeting
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

export default MyBookings;
