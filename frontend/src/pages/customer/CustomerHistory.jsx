import React, { useState, useEffect } from 'react';
import { History, Star, Clock, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/Modal';

const CustomerHistory = () => {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings?status=COMPLETED');
      if (res.data.success) {
        setCompleted(res.data.bookings);
      }
    } catch (err) {
      console.warn('Failed to load completed consultations:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenReview = (b) => {
    setSelectedBooking(b);
    setRating(b.clientRating || 5);
    setReviewText(b.clientReview || '');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setSubmittingReview(true);
    try {
      const res = await api.post(`/bookings/${selectedBooking._id}/review`, {
        rating,
        review: reviewText,
      });
      if (res.data.success) {
        setReviewModalOpen(false);
        await fetchHistory();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Consultation Archive & Remedies
        </h2>
        <p className="text-xs text-stone-500">
          Review notes from past Vedic consultations and leave ratings for your astrologer.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Astrologer</th>
                <th className="px-5 py-3">Topic & Duration</th>
                <th className="px-5 py-3">Date Completed</th>
                <th className="px-5 py-3">Astrologer Remedies / Notes</th>
                <th className="px-5 py-3 text-right">Your Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-stone-500">
                    Loading completed consultations...
                  </td>
                </tr>
              ) : completed.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-stone-500">
                    No completed consultations found yet.
                  </td>
                </tr>
              ) : (
                completed.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50">
                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                      {b.bookingId}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-stone-900">{b.executiveId?.name}</div>
                      <div className="text-[11px] text-stone-500">{b.executiveProfile?.title}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-medium text-stone-800">{b.consultationTopic}</div>
                      <div className="text-[10px] text-stone-500">{b.selectedDuration} mins</div>
                    </td>

                    <td className="px-5 py-3.5 text-stone-600">
                      {new Date(b.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-5 py-3.5 max-w-xs">
                      {b.executiveNotes ? (
                        <p className="text-[11px] text-stone-700 bg-ivory-100 p-2 rounded border border-stone-200 line-clamp-2">
                          {b.executiveNotes}
                        </p>
                      ) : (
                        <span className="text-stone-400 text-[11px]">No notes recorded</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {b.clientRating ? (
                        <div className="flex items-center justify-end gap-1 text-amber-500">
                          {[...Array(b.clientRating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                          <button
                            type="button"
                            onClick={() => handleOpenReview(b)}
                            className="ml-2 text-stone-400 hover:text-stone-700 text-[11px] underline"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(b)}
                          className="px-3 py-1 rounded-lg bg-gold-100 hover:bg-gold-200 text-maroon-900 font-semibold text-xs border border-gold-300"
                        >
                          Write Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedBooking && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title={`Review Your Consultation: ${selectedBooking.executiveId?.name}`}
        >
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs text-stone-700">
            <p className="text-stone-600">
              Share your feedback regarding your {selectedBooking.consultationTopic} consultation. Your review helps other seekers in our community.
            </p>

            <div>
              <label className="block text-stone-800 font-semibold mb-1">
                Your Rating (1 to 5 Stars) *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-stone-300 stroke-1'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-stone-800 font-semibold mb-1">
                Your Review & Testimonial
              </label>
              <textarea
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was your consultation experience? Was the astrological reading clear and helpful?..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-bold disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CustomerHistory;
