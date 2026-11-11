import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Plus,
} from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import ConsultationTimer from '../../components/ConsultationTimer';

const ScheduledMeetings = () => {
  const [searchParams] = useSearchParams();
  const scheduleIdParam = searchParams.get('scheduleId');

  const [scheduledBookings, setScheduledBookings] = useState([]);
  const [verifiedUnscheduled, setVerifiedUnscheduled] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheduling Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [bookingToSchedule, setBookingToSchedule] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [customMeetingUrl, setCustomMeetingUrl] = useState('');
  const [manualPasscode, setManualPasscode] = useState('');
  const [submittingSchedule, setSubmittingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState('');

  // Rescheduling Modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [bookingToReschedule, setBookingToReschedule] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  // Mark Completed Modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState(null);
  const [executiveNotes, setExecutiveNotes] = useState('');
  const [completing, setCompleting] = useState(false);

  const fetchMeetingsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/executive/bookings');
      if (res.data.success) {
        const all = res.data.bookings;
        setScheduledBookings(all.filter((b) => b.bookingStatus === 'SCHEDULED'));
        setVerifiedUnscheduled(all.filter((b) => b.bookingStatus === 'PAYMENT_VERIFIED'));

        if (scheduleIdParam) {
          const match = all.find((b) => b._id === scheduleIdParam);
          if (match && match.bookingStatus === 'PAYMENT_VERIFIED') {
            handleOpenSchedule(match);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load meetings data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingsData();
  }, [scheduleIdParam]);

  const handleOpenSchedule = (booking) => {
    setBookingToSchedule(booking);
    // Default to booking's preferred date or today
    const prefDate = booking.preferredDate ? new Date(booking.preferredDate).toISOString().split('T')[0] : '';
    setScheduleDate(prefDate || new Date().toISOString().split('T')[0]);
    setScheduleTime('11:00');
    setCustomMeetingUrl('');
    setManualPasscode('');
    setScheduleError('');
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    if (!bookingToSchedule) return;
    setScheduleError('');
    setSubmittingSchedule(true);

    try {
      const scheduledStartTime = new Date(`${scheduleDate}T${scheduleTime}:00`);

      const res = await api.put(`/executive/bookings/${bookingToSchedule._id}/schedule`, {
        scheduledStartTime: scheduledStartTime.toISOString(),
        customMeetingUrl: customMeetingUrl || undefined,
        manualPasscode: manualPasscode || undefined,
      });

      if (res.data.success) {
        setScheduleModalOpen(false);
        await fetchMeetingsData();
      }
    } catch (err) {
      setScheduleError(err.response?.data?.message || 'Failed to schedule meeting.');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleOpenReschedule = (booking) => {
    setBookingToReschedule(booking);
    if (booking.scheduledStartTime) {
      const d = new Date(booking.scheduledStartTime);
      setRescheduleDate(d.toISOString().split('T')[0]);
      setRescheduleTime(d.toTimeString().slice(0, 5));
    }
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async (e) => {
    e.preventDefault();
    if (!bookingToReschedule) return;
    setRescheduling(true);
    try {
      const newStart = new Date(`${rescheduleDate}T${rescheduleTime}:00`);
      const res = await api.put(`/executive/bookings/${bookingToReschedule._id}/reschedule`, {
        scheduledStartTime: newStart.toISOString(),
      });
      if (res.data.success) {
        setRescheduleModalOpen(false);
        await fetchMeetingsData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reschedule.');
    } finally {
      setRescheduling(false);
    }
  };

  const handleOpenComplete = (booking) => {
    setBookingToComplete(booking);
    setExecutiveNotes('');
    setCompleteModalOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (!bookingToComplete) return;
    setCompleting(true);
    try {
      const res = await api.put(`/executive/bookings/${bookingToComplete._id}/complete`, {
        executiveNotes,
      });
      if (res.data.success) {
        setCompleteModalOpen(false);
        await fetchMeetingsData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete consultation.');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Scheduled Consultations & Zoom Coordination
        </h2>
        <p className="text-xs text-stone-500">
          Set meeting times for payment-verified bookings, generate Zoom rooms, track active session countdowns, and mark consultations as completed.
        </p>
      </div>

      {/* Section 1: Verified Bookings Ready to Schedule */}
      {verifiedUnscheduled.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-bold text-base text-amber-950">
                Verified Bookings Awaiting Meeting Slot ({verifiedUnscheduled.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-800">
              Payment is verified — please set consultation date & time
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedUnscheduled.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-maroon-900 text-xs block">
                    {b.bookingId}
                  </span>
                  <div className="font-semibold text-stone-900 text-sm">
                    {b.customerId?.name}
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    {b.consultationTopic} • <strong className="text-maroon-800">{b.selectedDuration} mins</strong>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Pref: {new Date(b.preferredDate).toLocaleDateString('en-IN')} ({b.preferredTime})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenSchedule(b)}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Slot</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Active Scheduled Consultations List */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-base text-maroon-900">
          Confirmed Scheduled Consultations ({scheduledBookings.length})
        </h3>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 mt-2">Loading meetings...</p>
          </div>
        ) : scheduledBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-xs">
            No consultations are scheduled at this moment.
          </div>
        ) : (
          <div className="space-y-6">
            {scheduledBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                    <div>
                      <span className="font-mono font-bold text-maroon-900 text-xs">
                        {b.bookingId}
                      </span>
                      <h4 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
                        {b.consultationTopic}
                      </h4>
                      <div className="text-xs text-stone-600">
                        Client: <strong className="text-stone-900">{b.customerId?.name}</strong> ({b.customerId?.phone})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReschedule(b)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleOpenComplete(b)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>

                  {/* Integrated Timer Component */}
                  <div className="mt-4">
                    <ConsultationTimer
                      scheduledStartTime={b.scheduledStartTime}
                      scheduledEndTime={b.scheduledEndTime}
                      durationMinutes={b.selectedDuration}
                      zoomMeetingUrl={b.zoomMeetingUrl}
                      zoomPasscode={b.zoomPasscode}
                      isExecutive={true}
                      onComplete={() => handleOpenComplete(b)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {scheduleModalOpen && bookingToSchedule && (
        <Modal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          title={`Schedule Zoom Consultation: ${bookingToSchedule.bookingId}`}
        >
          <form onSubmit={handleConfirmSchedule} className="space-y-4 text-xs text-stone-700">
            {scheduleError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{scheduleError}</span>
              </div>
            )}

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <div className="flex justify-between font-semibold text-stone-900">
                <span>Client: {bookingToSchedule.customerId?.name}</span>
                <span className="text-maroon-800">Purchased Duration: {bookingToSchedule.selectedDuration} Minutes</span>
              </div>
              <div className="text-[11px] text-stone-500">
                Client preferred: {new Date(bookingToSchedule.preferredDate).toLocaleDateString('en-IN')} at {bookingToSchedule.preferredTime}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-800 font-semibold mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-stone-800 font-semibold mb-1">
                  Start Time (IST) *
                </label>
                <input
                  type="time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-800 font-semibold mb-1">
                Custom Zoom Link (Optional - uses your default Zoom room if empty)
              </label>
              <input
                type="url"
                value={customMeetingUrl}
                onChange={(e) => setCustomMeetingUrl(e.target.value)}
                placeholder="https://zoom.us/j/123456789"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-800 font-semibold mb-1">
                Meeting Passcode (Optional)
              </label>
              <input
                type="text"
                value={manualPasscode}
                onChange={(e) => setManualPasscode(e.target.value)}
                placeholder="e.g. VEDIC108"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="p-3 bg-purple-50 rounded-xl text-[11px] text-purple-900 border border-purple-200 leading-relaxed">
              <strong>Automatic End-Time Calculation:</strong> When set for {scheduleTime || '00:00'}, the system automatically schedules the session to end exactly {bookingToSchedule.selectedDuration} minutes later. Overlapping consultations are automatically detected and prevented.
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingSchedule}
                className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold disabled:opacity-50"
              >
                {submittingSchedule ? 'Scheduling...' : 'Save & Confirm Zoom Session'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && bookingToReschedule && (
        <Modal
          isOpen={rescheduleModalOpen}
          onClose={() => setRescheduleModalOpen(false)}
          title={`Reschedule Consultation: ${bookingToReschedule.bookingId}`}
        >
          <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs text-stone-700">
            <p className="text-stone-600">
              Select the new start date and time for {bookingToReschedule.customerId?.name}. Duration ({bookingToReschedule.selectedDuration} mins) remains preserved.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-800 font-semibold mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-stone-800 font-semibold mb-1">New Start Time</label>
                <input
                  type="time"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rescheduling}
                className="px-5 py-2 rounded-lg bg-purple-700 text-white font-bold disabled:opacity-50"
              >
                {rescheduling ? 'Updating...' : 'Confirm Reschedule'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Complete Modal */}
      {completeModalOpen && bookingToComplete && (
        <Modal
          isOpen={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          title={`Conclude Consultation: ${bookingToComplete.bookingId}`}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCompleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                disabled={completing}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {completing ? 'Concluding...' : 'Mark Consultation Completed'}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-stone-700">
            <p className="text-stone-600">
              Confirm that the Zoom consultation for {bookingToComplete.customerId?.name} ({bookingToComplete.consultationTopic}) has been completed.
            </p>
            <div>
              <label className="block text-stone-800 font-semibold mb-1">
                Consultant Remedies & Notes (Optional)
              </label>
              <textarea
                rows="4"
                value={executiveNotes}
                onChange={(e) => setExecutiveNotes(e.target.value)}
                placeholder="Prescribed gemstone, mantra recommendations, or follow-up notes..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ScheduledMeetings;
