import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  QrCode,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Video,
  ExternalLink,
  ChevronLeft,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';
import { PaymentStatusBadge, BookingStatusBadge } from '../../components/StatusBadge';
import ConsultationTimer from '../../components/ConsultationTimer';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${bookingId}`);
      if (res.data.success) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleCopyUpi = () => {
    if (booking?.executiveProfile?.upiId) {
      navigator.clipboard.writeText(booking.executiveProfile.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!screenshotFile) {
      setErrorMsg('Please select a payment screenshot image.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = new FormData();
      data.append('screenshot', screenshotFile);
      if (transactionRef) data.append('transactionRef', transactionRef.trim());

      const res = await api.post(`/bookings/${booking._id}/payment-proof`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSuccessMsg('Payment proof uploaded successfully! The astrologer will verify the transaction.');
        setScreenshotFile(null);
        await fetchBooking();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit payment proof.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 mt-2">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-3">
        <h3 className="font-serif font-bold text-lg text-maroon-900">Booking Not Found</h3>
        <p className="text-xs text-stone-500">{errorMsg || 'Unable to locate this consultation booking.'}</p>
        <Link
          to="/dashboard/bookings"
          className="inline-block px-4 py-2 rounded-lg bg-maroon-700 text-white font-semibold text-xs"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  const {
    paymentStatus,
    bookingStatus,
    totalAmount,
    selectedDuration,
    consultationTopic,
    executiveId,
    executiveProfile,
    paymentScreenshot,
    paymentRejectionReason,
  } = booking;

  // Timeline Steps
  const timeline = [
    { key: 'CREATED', label: 'Booking Created', done: true },
    {
      key: 'SUBMITTED',
      label: 'Proof Submitted',
      done: paymentStatus === 'UNDER_VERIFICATION' || paymentStatus === 'PAYMENT_VERIFIED',
    },
    {
      key: 'VERIFIED',
      label: 'Payment Verified',
      done: paymentStatus === 'PAYMENT_VERIFIED',
    },
    {
      key: 'SCHEDULED',
      label: 'Consultation Scheduled',
      done: bookingStatus === 'SCHEDULED' || bookingStatus === 'COMPLETED',
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      done: bookingStatus === 'COMPLETED',
    },
  ];

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-maroon-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </Link>

        <button
          onClick={fetchBooking}
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
          title="Refresh Status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Header Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-maroon-900 text-sm">
                {booking.bookingId}
              </span>
              <PaymentStatusBadge status={paymentStatus} />
              <BookingStatusBadge status={bookingStatus} />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
              {consultationTopic}
            </h2>
            <p className="text-xs text-stone-600">
              Astrologer: <strong>{executiveId?.name}</strong> ({executiveProfile?.title || 'Acharya'})
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-500 uppercase tracking-wider block">Total Payable</span>
            <div className="text-2xl font-serif font-bold text-maroon-900">
              ₹{totalAmount}
            </div>
            <span className="text-xs text-stone-500">
              {selectedDuration} mins @ ₹{booking.pricePerMinuteSnapshot}/m
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="py-2">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {timeline.map((step, idx) => (
              <div
                key={step.key}
                className={`p-2.5 rounded-xl border transition-colors ${
                  step.done
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                <div className="text-[10px] text-stone-400 mb-0.5">Step 0{idx + 1}</div>
                <div className="truncate">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* REJECTION ALERT IF PAYMENT WAS REJECTED */}
      {paymentStatus === 'PAYMENT_REJECTED' && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2">
          <div className="flex items-center gap-2 font-serif font-bold text-sm text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Payment Proof Verification Declined</span>
          </div>
          <p className="text-xs leading-relaxed text-rose-800">
            <strong>Reason stated by astrologer:</strong> "{paymentRejectionReason || 'Receipt details were not legible or did not match bank records.'}"
          </p>
          <p className="text-[11px] text-rose-700">
            Please review your UPI transaction, ensure the 12-digit UTR reference is clearly visible, and upload a new screenshot below.
          </p>
        </div>
      )}

      {/* IF SCHEDULED: DISPLAY LIVE CONSULTATION TIMER AND ZOOM DETAILS */}
      {bookingStatus === 'SCHEDULED' && booking.scheduledStartTime && (
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-maroon-900">
            Your Confirmed Video Consultation
          </h3>
          <ConsultationTimer
            scheduledStartTime={booking.scheduledStartTime}
            scheduledEndTime={booking.scheduledEndTime}
            durationMinutes={booking.selectedDuration}
            zoomMeetingUrl={booking.zoomMeetingUrl}
            zoomPasscode={booking.zoomPasscode}
            isExecutive={false}
          />
        </div>
      )}

      {/* IF PAYMENT IS VERIFIED BUT NOT YET SCHEDULED */}
      {paymentStatus === 'PAYMENT_VERIFIED' && bookingStatus !== 'SCHEDULED' && (
        <div className="bg-white rounded-2xl p-8 border border-emerald-300 shadow-sm text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-emerald-950">
            Payment Verified Successfully!
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            {executiveId?.name} has verified your payment of ₹{totalAmount}. They are currently preparing your Janam Kundli and will schedule the Zoom video slot shortly.
          </p>
          <span className="inline-block text-[11px] font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
            You will receive an in-app notification and email once the session time is confirmed.
          </span>
        </div>
      )}

      {/* IF PROOF SUBMITTED & UNDER VERIFICATION */}
      {paymentStatus === 'UNDER_VERIFICATION' && (
        <div className="bg-white rounded-2xl p-8 border border-amber-300 shadow-sm text-center space-y-3">
          <Clock className="w-12 h-12 text-amber-600 mx-auto animate-pulse" />
          <h3 className="font-serif font-bold text-lg text-amber-950">
            Payment Proof Submitted — Awaiting Verification
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Your payment receipt has been submitted to {executiveId?.name}. To maintain complete security, the astrologer manually validates the transaction against their bank statement.
          </p>
          <p className="text-[11px] text-stone-500">
            Verification typically completes within 1 to 2 hours during normal hours.
          </p>

          {paymentScreenshot?.url && (
            <div className="pt-2">
              <span className="text-[10px] text-stone-400 block mb-1">Your Submitted Proof:</span>
              <img
                src={paymentScreenshot.url}
                alt="Submitted Proof"
                className="w-32 h-32 object-cover rounded-xl border border-stone-200 mx-auto shadow-xs"
              />
            </div>
          )}
        </div>
      )}

      {/* IF PAYMENT IS PENDING OR REJECTED: DISPLAY QR CODE AND UPLOAD FORM */}
      {(paymentStatus === 'PAYMENT_PENDING' || paymentStatus === 'PAYMENT_REJECTED') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Astrologer's Personal UPI QR Code Card */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5 text-center">
            <div className="space-y-1">
              <span className="text-xs font-serif font-semibold text-gold-700 uppercase tracking-widest block">
                Direct Astrologer UPI QR
              </span>
              <h3 className="font-serif font-bold text-lg text-maroon-900">
                Scan to Pay: ₹{totalAmount}
              </h3>
              <p className="text-xs text-stone-500">
                Pay using Google Pay, PhonePe, Paytm, or BHIM.
              </p>
            </div>

            {/* QR Image Display */}
            <div className="w-64 h-64 mx-auto bg-stone-50 rounded-2xl p-3 border-2 border-dashed border-stone-300 flex items-center justify-center">
              {executiveProfile?.qrCode?.url ? (
                <img
                  src={executiveProfile.qrCode.url}
                  alt={`${executiveId?.name} UPI QR`}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-stone-400 space-y-2">
                  <QrCode className="w-16 h-16 mx-auto stroke-1" />
                  <span className="text-xs block">Astrologer UPI Code</span>
                </div>
              )}
            </div>

            {/* UPI ID with One-Click Copy */}
            {executiveProfile?.upiId && (
              <div className="space-y-1">
                <span className="text-[11px] text-stone-500 block">Or pay directly to UPI ID:</span>
                <div className="flex items-center justify-center gap-2">
                  <code className="px-3 py-1.5 rounded-lg bg-ivory-100 border border-stone-200 font-mono text-xs font-bold text-maroon-900">
                    {executiveProfile.upiId}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Custom Payment Instructions from Astrologer */}
            {executiveProfile?.paymentInstructions && (
              <div className="p-3 bg-ivory-50 rounded-xl border border-stone-200 text-left text-xs text-stone-600 leading-relaxed">
                <strong className="text-maroon-900 block font-semibold mb-1">
                  Payment Instructions:
                </strong>
                {executiveProfile.paymentInstructions}
              </div>
            )}
          </div>

          {/* Right: Payment Screenshot Upload Form */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
            <div>
              <h3 className="font-serif font-bold text-base text-maroon-900">
                Upload Payment Screenshot
              </h3>
              <p className="text-xs text-stone-500">
                Submit a screenshot showing the 12-digit UTR/UPI reference number.
              </p>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              {/* File Drop / Preview Zone */}
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center hover:border-gold-500 transition-colors">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Selected Screenshot"
                      className="max-h-48 mx-auto rounded-lg object-contain border border-stone-200 shadow-xs"
                    />
                    <label className="inline-block px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 cursor-pointer">
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-6 cursor-pointer space-y-2">
                    <Upload className="w-8 h-8 text-stone-400" />
                    <span className="text-xs font-semibold text-stone-800">
                      Click to choose screenshot or photo
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Accepts JPG, JPEG, PNG (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  12-Digit UPI Reference / UTR Number (Optional but recommended)
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. 119283746592"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="p-3 bg-ivory-100 rounded-xl border border-gold-300/60 flex items-start gap-2.5 text-xs text-stone-700">
                <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>
                  After submitting, your payment is held under verification until {executiveId?.name} manually checks their account. Zoom links are unlocked upon verification.
                </span>
              </div>

              <button
                type="submit"
                disabled={uploading || !screenshotFile}
                className="w-full py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <span>Uploading payment proof...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Submit Payment Proof for Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
