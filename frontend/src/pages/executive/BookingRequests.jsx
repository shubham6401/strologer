import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  Download,
  Clock,
  User,
} from 'lucide-react';
import api from '../../services/api';
import { PaymentStatusBadge, BookingStatusBadge } from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const BookingRequests = () => {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [bookingFilter, setBookingFilter] = useState('ALL');

  // Inspection Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  // Rejection Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // Screenshot enlarged modal state
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [currentScreenshotUrl, setCurrentScreenshotUrl] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/executive/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);

        // If ID passed in query params, auto-open inspection
        if (highlightId) {
          const match = res.data.bookings.find((b) => b._id === highlightId);
          if (match) {
            setSelectedBooking(match);
            setInspectModalOpen(true);
          }
        }
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

  // Filter bookings locally for speed and responsive feel
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.consultationTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.customerId?.name && b.customerId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.customerId?.phone && b.customerId.phone.includes(searchTerm));

    const matchesPayment = paymentFilter === 'ALL' || b.paymentStatus === paymentFilter;
    const matchesBooking = bookingFilter === 'ALL' || b.bookingStatus === bookingFilter;

    return matchesSearch && matchesPayment && matchesBooking;
  });

  const handleOpenVerify = (booking) => {
    setSelectedBooking(booking);
    setVerificationNotes('Verified matching credit in UPI bank statement.');
    setVerifyModalOpen(true);
  };

  const handleConfirmVerify = async () => {
    if (!selectedBooking) return;
    setVerifying(true);
    try {
      const res = await api.put(`/executive/bookings/${selectedBooking._id}/verify-payment`, {
        notes: verificationNotes,
      });
      if (res.data.success) {
        setVerifyModalOpen(false);
        setInspectModalOpen(false);
        await fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify payment.');
    } finally {
      setVerifying(false);
    }
  };

  const handleOpenReject = (booking) => {
    setSelectedBooking(booking);
    setRejectReason('Transaction reference number (UTR) is illegible or missing in the screenshot.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedBooking) return;
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting the payment proof.');
      return;
    }
    setRejecting(true);
    try {
      const res = await api.put(`/executive/bookings/${selectedBooking._id}/reject-payment`, {
        reason: rejectReason,
      });
      if (res.data.success) {
        setRejectModalOpen(false);
        setInspectModalOpen(false);
        await fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject payment.');
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-maroon-900">
            Booking Requests & Records
          </h2>
          <p className="text-xs text-stone-500">
            Inspect customer inquiries, verify manual UPI payment screenshots, and coordinate video appointments.
          </p>
        </div>
        <Link
          to="/executive/payment-verification"
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Go to Payment Verification Queue</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, phone, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 bg-white"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="UNDER_VERIFICATION">Under Verification</option>
            <option value="PAYMENT_VERIFIED">Payment Verified</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="PAYMENT_REJECTED">Payment Rejected</option>
          </select>
        </div>

        <div>
          <select
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 bg-white"
          >
            <option value="ALL">All Booking Statuses</option>
            <option value="CREATED">Created (Awaiting Payment)</option>
            <option value="PAYMENT_SUBMITTED">Proof Submitted</option>
            <option value="PAYMENT_VERIFIED">Payment Confirmed</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Administrative Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Client Details</th>
                <th className="px-5 py-3">Consultation Topic</th>
                <th className="px-5 py-3">Duration & Fee</th>
                <th className="px-5 py-3">Payment Proof</th>
                <th className="px-5 py-3">Statuses</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-stone-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-stone-500">
                    No booking records found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50/70 transition-colors">
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
                      <div className="font-semibold text-stone-900">{b.customerId?.name || 'Seeker'}</div>
                      <div className="text-[11px] text-stone-500">{b.customerId?.phone}</div>
                      <div className="text-[10px] text-stone-400 truncate max-w-[140px]">{b.customerId?.email}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-medium text-stone-800">{b.consultationTopic}</div>
                      <div className="text-[10px] text-stone-500">
                        Pref: {new Date(b.preferredDate).toLocaleDateString('en-IN')} ({b.preferredTime})
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-serif font-bold text-maroon-900 text-sm">
                        ₹{b.totalAmount}
                      </div>
                      <span className="text-[10px] text-stone-500">
                        {b.selectedDuration}m @ ₹{b.pricePerMinuteSnapshot}/m
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {b.paymentScreenshot?.url ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentScreenshotUrl(b.paymentScreenshot.url);
                            setScreenshotModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px]"
                        >
                          <img
                            src={b.paymentScreenshot.url}
                            alt=""
                            className="w-5 h-5 rounded object-cover"
                          />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Not uploaded</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 space-y-1">
                      <div>
                        <PaymentStatusBadge status={b.paymentStatus} />
                      </div>
                      <div>
                        <BookingStatusBadge status={b.bookingStatus} />
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setInspectModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium"
                        title="View Details"
                      >
                        Inspect
                      </button>

                      {b.paymentStatus === 'UNDER_VERIFICATION' && (
                        <>
                          <button
                            onClick={() => handleOpenVerify(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            title="Verify Payment"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleOpenReject(b)}
                            className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold"
                            title="Reject Payment"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {b.bookingStatus === 'PAYMENT_VERIFIED' && (
                        <Link
                          to={`/executive/scheduled-consultations?scheduleId=${b._id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold"
                        >
                          Schedule
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

      {/* Inspect Modal */}
      {inspectModalOpen && selectedBooking && (
        <Modal
          isOpen={inspectModalOpen}
          onClose={() => setInspectModalOpen(false)}
          title={`Booking Details: ${selectedBooking.bookingId}`}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
              {selectedBooking.paymentStatus === 'UNDER_VERIFICATION' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectModalOpen(false);
                      handleOpenReject(selectedBooking);
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
                  >
                    Reject Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectModalOpen(false);
                      handleOpenVerify(selectedBooking);
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                  >
                    Verify Payment
                  </button>
                </>
              )}
              {selectedBooking.bookingStatus === 'PAYMENT_VERIFIED' && (
                <Link
                  to={`/executive/scheduled-consultations?scheduleId=${selectedBooking._id}`}
                  className="px-4 py-2 rounded-lg bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800"
                >
                  Schedule Zoom Meeting →
                </Link>
              )}
            </div>
          }
        >
          <div className="space-y-6 text-xs text-stone-700">
            {/* Top overview grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-ivory-100 border border-stone-200">
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Duration</span>
                <span className="font-semibold text-stone-900 text-sm">{selectedBooking.selectedDuration} Minutes</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Total Amount</span>
                <span className="font-serif font-bold text-maroon-900 text-base">₹{selectedBooking.totalAmount}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Payment Status</span>
                <PaymentStatusBadge status={selectedBooking.paymentStatus} />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Session Status</span>
                <BookingStatusBadge status={selectedBooking.bookingStatus} />
              </div>
            </div>

            {/* Client & Birth Details */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-maroon-900 border-b border-stone-100 pb-1">
                Client Information & Kundli Birth Data
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block text-[11px]">Full Name</span>
                  <span className="font-semibold text-stone-900">{selectedBooking.customerId?.name}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Phone & Email</span>
                  <span className="text-stone-900 font-medium">
                    {selectedBooking.customerId?.phone} • {selectedBooking.customerId?.email}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Date of Birth</span>
                  <span className="text-stone-900">
                    {selectedBooking.clientBirthDetails?.dateOfBirth || selectedBooking.customerId?.birthDetails?.dateOfBirth || 'Not provided'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Time & Place of Birth</span>
                  <span className="text-stone-900">
                    {selectedBooking.clientBirthDetails?.timeOfBirth || selectedBooking.customerId?.birthDetails?.timeOfBirth || 'Not provided'} —{' '}
                    {selectedBooking.clientBirthDetails?.placeOfBirth || selectedBooking.customerId?.birthDetails?.placeOfBirth || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Problem / Consultation Concern */}
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-maroon-900">Consultation Topic & Problem Description</h4>
              <p className="font-semibold text-stone-900">{selectedBooking.consultationTopic}</p>
              <p className="text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200 whitespace-pre-wrap leading-relaxed">
                {selectedBooking.problemDescription || 'No detailed description provided by client.'}
              </p>
            </div>

            {/* Payment Proof Preview if present */}
            {selectedBooking.paymentScreenshot?.url && (
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-maroon-900">Submitted Payment Screenshot</h4>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedBooking.paymentScreenshot.url}
                      alt="Receipt"
                      className="w-16 h-16 object-cover rounded-lg border border-stone-300 cursor-pointer"
                      onClick={() => {
                        setCurrentScreenshotUrl(selectedBooking.paymentScreenshot.url);
                        setScreenshotModalOpen(true);
                      }}
                    />
                    <div>
                      <span className="font-semibold text-stone-900 block">
                        Transaction Ref / UTR: {selectedBooking.paymentScreenshot.transactionRef || 'Not stated'}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Uploaded on: {new Date(selectedBooking.paymentScreenshot.uploadedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreenshotUrl(selectedBooking.paymentScreenshot.url);
                      setScreenshotModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-100"
                  >
                    Enlarge Screenshot
                  </button>
                </div>
              </div>
            )}

            {/* Zoom meeting details if scheduled */}
            {selectedBooking.zoomMeetingUrl && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                <h5 className="font-serif font-bold text-purple-900">Scheduled Zoom Session</h5>
                <p className="text-[11px] text-purple-800">
                  Starts: {new Date(selectedBooking.scheduledStartTime).toLocaleString('en-IN')} to{' '}
                  {new Date(selectedBooking.scheduledEndTime).toLocaleTimeString('en-IN')}
                </p>
                <div className="pt-2 flex gap-3">
                  <a
                    href={selectedBooking.zoomMeetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-3 py-1 rounded bg-purple-700 text-white font-semibold text-xs"
                  >
                    Launch Zoom Room
                  </a>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* High-Resolution Screenshot Modal */}
      {screenshotModalOpen && (
        <Modal
          isOpen={screenshotModalOpen}
          onClose={() => setScreenshotModalOpen(false)}
          title="Payment Proof Screenshot (High Resolution)"
          maxWidth="max-w-3xl"
        >
          <div className="text-center space-y-3">
            <img
              src={currentScreenshotUrl}
              alt="Full Payment Screenshot"
              className="max-h-[70vh] mx-auto rounded-xl border border-stone-300 shadow-md object-contain"
            />
            <p className="text-xs text-stone-500">
              Check the 12-digit UTR/UPI reference against your bank or UPI transaction log before approving.
            </p>
          </div>
        </Modal>
      )}

      {/* Manual Verification Confirmation Modal */}
      {verifyModalOpen && selectedBooking && (
        <Modal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          title={`Confirm Payment Verification: ${selectedBooking.bookingId}`}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVerifyModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerify}
                disabled={verifying}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Yes, Confirm Payment Received'}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-stone-700">
            <p className="text-sm font-semibold text-stone-900">
              Are you sure you want to verify ₹{selectedBooking.totalAmount} received from {selectedBooking.customerId?.name}?
            </p>
            <p className="text-stone-600">
              By confirming, you acknowledge that you have personally inspected your UPI statement and verified that the transaction has completed. This action will notify the customer and unlock Zoom scheduling.
            </p>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Internal Verification Notes (Optional)
              </label>
              <input
                type="text"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Payment Rejection Modal */}
      {rejectModalOpen && selectedBooking && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title={`Reject Payment Proof: ${selectedBooking.bookingId}`}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={rejecting}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {rejecting ? 'Rejecting...' : 'Reject & Request Resubmission'}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-stone-700">
            <p className="text-stone-600">
              Please state why this transaction could not be verified. This reason will be immediately displayed to {selectedBooking.customerId?.name} so they can resubmit the correct screenshot.
            </p>
            <div>
              <label className="block text-stone-800 font-semibold mb-1">
                Reason for Rejection *
              </label>
              <textarea
                rows="3"
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR number not visible, amount is incorrect, or transaction not found in bank statement..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingRequests;
