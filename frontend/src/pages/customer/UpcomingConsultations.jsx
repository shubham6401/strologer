import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../services/api';
import ConsultationTimer from '../../components/ConsultationTimer';

const UpcomingConsultations = () => {
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduled = async () => {
      try {
        const res = await api.get('/bookings/my-bookings?status=SCHEDULED');
        if (res.data.success) {
          setScheduled(res.data.bookings);
        }
      } catch (err) {
        console.warn('Failed to load upcoming sessions:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchScheduled();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Upcoming Scheduled Consultations
        </h2>
        <p className="text-xs text-stone-500">
          Access your confirmed Zoom meeting rooms and live countdown timers.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 mt-2">Checking schedule...</p>
        </div>
      ) : scheduled.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-xs space-y-3 max-w-md mx-auto">
          <Video className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-stone-900">
            No Upcoming Consultations
          </h3>
          <p className="leading-relaxed">
            You currently have no scheduled Zoom sessions. Once payment for a booking is verified, your astrologer will confirm your video slot here.
          </p>
          <div className="pt-2">
            <Link
              to="/astrologers"
              className="inline-block px-5 py-2.5 rounded-xl bg-maroon-700 text-white font-semibold text-xs shadow-xs"
            >
              Book an Astrologer
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {scheduled.map((b) => (
            <div key={b._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-maroon-900 text-xs">
                    {b.bookingId}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    {b.consultationTopic}
                  </h3>
                  <p className="text-xs text-stone-600">
                    With <strong>{b.executiveId?.name}</strong> ({b.executiveProfile?.title || 'Astrologer'})
                  </p>
                </div>
              </div>

              <ConsultationTimer
                scheduledStartTime={b.scheduledStartTime}
                scheduledEndTime={b.scheduledEndTime}
                durationMinutes={b.selectedDuration}
                zoomMeetingUrl={b.zoomMeetingUrl}
                zoomPasscode={b.zoomPasscode}
                isExecutive={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingConsultations;
