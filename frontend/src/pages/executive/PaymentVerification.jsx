import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/Modal';

const PaymentVerification = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('Payment confirmed via UPI statement.');
  const [verifying, setVerifying] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Transaction reference number (UTR) is illegible or not found in bank statement.');
  const [rejecting, setRejecting] = useState(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await api.get('/executive/bookings?paymentStatus=UNDER_VERIFICATION');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.warn('Failed to load verification queue:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleOpenVerify = (b) => {
    setSelectedBooking(b);
    setVerifyNotes('Payment confirmed via UPI statement.');
    setVerifyModalOpen(true);
  };

  const handleConfirmVerify = async () => {
    if (!selectedBooking) return;
    setVerifying(true);
    try {
      const res = await api.put(`/executive/bookings/${selectedBooking._id}/verify-payment`, {
        notes: verifyNotes,
      });
      if (res.data.success) {
        setVerifyModalOpen(false);
        await fetchQueue();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleOpenReject = (b) => {
    setSelectedBooking(b);
    setRejectReason('Transaction reference number (UTR) is illegible or not found in bank statement.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedBooking) return;
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    setRejecting(true);
    try {
      const res = await api.put(`/executive/bookings/${selectedBooking._id}/reject-payment`, {
        reason: rejectReason,
      });
      if (res.data.success) {
        setRejectModalOpen(false);
        await fetchQueue();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-maroon-900">
            Manual Payment Verification Queue
          </h2>
          <p className="text-xs text-stone-500">
            Review submitted UPI payment screenshots. Verify actual credits in your bank/UPI app before approving.
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Manual verification advisory notice */}
      <div className="p-4 rounded-xl bg-ivory-100 border border-gold-300 text-xs text-stone-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block text-maroon-900 font-semibold mb-0.5">
            Strict Manual Verification Workflow:
          </strong>
          Our platform does not blindly verify bookings when an image is uploaded. Open each customer’s screenshot, check the 12-digit UTR reference against your Google Pay / PhonePe / Paytm / BHIM app, and confirm funds have credited before approving.
        </div>
      </div>

      {/* Queue Cards / Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 mt-2">Checking verification queue...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-serif font-bold text-base text-stone-900">
            All Payments Verified!
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            There are currently no customer payment screenshots pending verification. You can proceed to schedule meetings for verified bookings.
          </p>
          <div className="pt-2">
            <Link
              to="/executive/scheduled-consultations"
              className="inline-block px-5 py-2 rounded-xl bg-maroon-700 text-white font-semibold text-xs shadow-xs"
            >
              Go to Scheduled Consultations →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-gold-400 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="font-mono font-bold text-maroon-900 text-sm">
                    {b.bookingId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Awaiting Verification
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Client</span>
                    <strong className="text-stone-900">{b.customerId?.name || 'Customer'}</strong>
                    <div className="text-[11px] text-stone-500">{b.customerId?.phone}</div>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Payable Amount</span>
                    <strong className="font-serif text-maroon-900 text-base">₹{b.totalAmount}</strong>
                    <div className="text-[10px] text-stone-500">{b.selectedDuration} mins session</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                  <div className="font-medium text-stone-800 truncate">{b.consultationTopic}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    Preferred: {new Date(b.preferredDate).toLocaleDateString('en-IN')} at {b.preferredTime}
                  </div>
                </div>

                {/* Screenshot snippet */}
                {b.paymentScreenshot?.url ? (
                  <div className="p-3 bg-ivory-100 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.paymentScreenshot.url}
                        alt="Screenshot"
                        className="w-12 h-12 object-cover rounded-lg border border-stone-300 cursor-pointer shadow-xs"
                        onClick={() => {
                          setScreenshotUrl(b.paymentScreenshot.url);
                          setScreenshotModalOpen(true);
                        }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-stone-900 block truncate max-w-[150px]">
                          UTR: {b.paymentScreenshot.transactionRef || 'Not entered'}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {new Date(b.paymentScreenshot.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotUrl(b.paymentScreenshot.url);
                        setScreenshotModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                    >
                      Enlarge
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-rose-600 font-medium">
                    No screenshot uploaded
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenReject(b)}
                  className="py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Proof</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenVerify(b)}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enlarged Screenshot Modal */}
      {screenshotModalOpen && (
        <Modal
          isOpen={screenshotModalOpen}
          onClose={() => setScreenshotModalOpen(false)}
          title="Payment Transaction Screenshot"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-3 text-center">
            <img
              src={screenshotUrl}
              alt="Screenshot Preview"
              className="max-h-[70vh] mx-auto rounded-xl border border-stone-300 shadow-md object-contain"
            />
            <p className="text-xs text-stone-500">
              Check the amount and transaction reference before approving.
            </p>
          </div>
        </Modal>
      )}

      {/* Verify Modal */}
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
                {verifying ? 'Verifying...' : 'Approve & Unlock Scheduling'}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-stone-700">
            <p className="text-sm font-semibold text-stone-900">
              Confirm receipt of ₹{selectedBooking.totalAmount} from {selectedBooking.customerId?.name}?
            </p>
            <p className="text-stone-600">
              Once verified, the booking status changes to "Payment Verified", the customer is notified, and you can immediately schedule their Zoom meeting slot.
            </p>
            <div>
              <label className="block text-stone-800 font-semibold mb-1">
                Verification Notes (Optional)
              </label>
              <input
                type="text"
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
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
                {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-stone-700">
            <p className="text-stone-600">
              Please enter the exact reason why this payment screenshot was rejected. The client will be notified and asked to resubmit proof.
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
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentVerification;
