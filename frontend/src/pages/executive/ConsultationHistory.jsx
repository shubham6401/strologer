import React, { useState, useEffect } from 'react';
import { History, Star, Calendar, Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';
import { BookingStatusBadge } from '../../components/StatusBadge';

const ConsultationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/executive/bookings');
        if (res.data.success) {
          // Filter completed or cancelled
          const past = res.data.bookings.filter(
            (b) => b.bookingStatus === 'COMPLETED' || b.bookingStatus === 'CANCELLED'
          );
          setHistory(past);
        }
      } catch (err) {
        console.warn('Failed to load consultation history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Consultation Archive & History
        </h2>
        <p className="text-xs text-stone-500">
          Audit trail of past completed sessions, client reviews, ratings, and recorded remedies.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Topic & Duration</th>
                <th className="px-5 py-3">Date Completed</th>
                <th className="px-5 py-3">Verified Fee</th>
                <th className="px-5 py-3">Client Feedback</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-stone-500">
                    Loading consultation archive...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-stone-500">
                    No completed or archived consultations yet.
                  </td>
                </tr>
              ) : (
                history.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50/70">
                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                      {b.bookingId}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-stone-900">{b.customerId?.name}</div>
                      <div className="text-[11px] text-stone-500">{b.customerId?.phone}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-medium text-stone-800">{b.consultationTopic}</div>
                      <div className="text-[10px] text-stone-500">{b.selectedDuration} mins</div>
                    </td>

                    <td className="px-5 py-3.5 text-stone-600">
                      {b.scheduledStartTime
                        ? new Date(b.scheduledStartTime).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : new Date(b.updatedAt).toLocaleDateString('en-IN')}
                    </td>

                    <td className="px-5 py-3.5 font-serif font-bold text-maroon-900">
                      ₹{b.totalAmount}
                    </td>

                    <td className="px-5 py-3.5 max-w-xs">
                      {b.clientRating ? (
                        <div>
                          <div className="flex items-center text-amber-500 gap-0.5">
                            {[...Array(b.clientRating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                            ))}
                            <span className="text-[11px] text-stone-600 ml-1 font-semibold">
                              ({b.clientRating}/5)
                            </span>
                          </div>
                          {b.clientReview && (
                            <p className="text-[11px] text-stone-500 italic truncate mt-0.5">
                              "{b.clientReview}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400 text-[11px]">No review submitted</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <BookingStatusBadge status={b.bookingStatus} />
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

export default ConsultationHistory;
