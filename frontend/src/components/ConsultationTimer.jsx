import React, { useState, useEffect } from 'react';
import { Clock, Video, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

const ConsultationTimer = ({
  scheduledStartTime,
  scheduledEndTime,
  durationMinutes = 30,
  zoomMeetingUrl,
  zoomPasscode,
  joinWindowMinutes = 10,
  isExecutive = false,
  onComplete = null,
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!scheduledStartTime) {
    return (
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
        <Clock className="w-5 h-5 flex-shrink-0" />
        <span>Consultation slot awaiting astrologer scheduling.</span>
      </div>
    );
  }

  const start = new Date(scheduledStartTime);
  // Calculate end time if not explicitly provided
  const end = scheduledEndTime
    ? new Date(scheduledEndTime)
    : new Date(start.getTime() + durationMinutes * 60 * 1000);

  const windowStart = new Date(start.getTime() - joinWindowMinutes * 60 * 1000);

  const isBeforeWindow = now < windowStart;
  const isInWindowBeforeStart = now >= windowStart && now < start;
  const isInSession = now >= start && now <= end;
  const isPastSession = now > end;

  // Time calculations
  const msToStart = start.getTime() - now.getTime();
  const msToEnd = end.getTime() - now.getTime();

  const formatCountdown = (ms) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h ${pad(minutes)}m`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const minutesRemainingInSession = Math.max(0, Math.floor(msToEnd / 60000));
  const secondsRemainingInSession = Math.max(0, Math.floor((msToEnd % 60000) / 1000));

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Banner Status */}
      <div
        className={`px-5 py-3 flex items-center justify-between text-sm font-medium ${
          isPastSession
            ? 'bg-stone-100 text-stone-700'
            : isInSession
            ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
            : isInWindowBeforeStart
            ? 'bg-amber-50 text-amber-800 border-b border-amber-100'
            : 'bg-ivory-100 text-maroon-800 border-b border-stone-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold-600" />
          <span>
            {isPastSession
              ? 'Consultation Session Concluded'
              : isInSession
              ? 'Consultation In Progress'
              : isInWindowBeforeStart
              ? 'Meeting Room Open (Starting Soon)'
              : 'Upcoming Scheduled Consultation'}
          </span>
        </div>
        <span className="text-xs uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded border border-stone-200">
          {durationMinutes} Min Session
        </span>
      </div>

      <div className="p-6">
        {/* Schedule Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-5 border-b border-stone-100 text-sm">
          <div>
            <span className="text-xs text-stone-500 block">Scheduled Date</span>
            <span className="font-semibold text-stone-800">
              {start.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-xs text-stone-500 block">Time Window (IST)</span>
            <span className="font-semibold text-stone-800">
              {start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} -{' '}
              {end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="col-span-2 md:col-span-1">
            <span className="text-xs text-stone-500 block">Zoom Passcode</span>
            <span className="font-mono font-semibold text-maroon-800">
              {zoomPasscode || 'None required'}
            </span>
          </div>
        </div>

        {/* Live Countdown / In-Session Timer */}
        <div className="my-6 text-center">
          {!isPastSession && !isInSession && (
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                Countdown to Consultation
              </span>
              <div className="text-3xl md:text-4xl font-mono font-bold text-maroon-900 mt-1">
                {formatCountdown(msToStart)}
              </div>
              {isBeforeWindow && (
                <p className="text-xs text-stone-500 mt-2">
                  The Zoom join button will activate automatically {joinWindowMinutes} minutes prior to start time.
                </p>
              )}
            </div>
          )}

          {isInSession && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block mb-1">
                Remaining Consultation Time
              </span>
              <div
                className={`text-4xl md:text-5xl font-mono font-bold ${
                  minutesRemainingInSession < 2
                    ? 'text-rose-600 animate-pulse'
                    : minutesRemainingInSession < 5
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                {String(minutesRemainingInSession).padStart(2, '0')}:
                {String(secondsRemainingInSession).padStart(2, '0')}
              </div>

              {minutesRemainingInSession < 5 && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>
                    Less than 5 minutes remaining. Please begin concluding your consultation queries.
                  </span>
                </div>
              )}
            </div>
          )}

          {isPastSession && (
            <div className="p-4 bg-stone-50 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-serif font-semibold text-stone-800">Session Complete</h4>
              <p className="text-xs text-stone-500 mt-1">
                This consultation reached its booked duration limit at {end.toLocaleTimeString()}.
              </p>
            </div>
          )}
        </div>

        {/* Action Button: Join Zoom Meeting */}
        <div className="space-y-3">
          {zoomMeetingUrl && (
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={zoomMeetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                  isBeforeWindow
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed pointer-events-none'
                    : 'bg-maroon-700 hover:bg-maroon-800 text-white hover:shadow-md'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>
                  {isExecutive ? 'Launch Zoom Room as Astrologer' : 'Join Zoom Consultation'}
                </span>
              </a>

              {isExecutive && !isPastSession && onComplete && (
                <button
                  type="button"
                  onClick={onComplete}
                  className="px-4 py-3 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Mark Completed
                </button>
              )}
            </div>
          )}

          {/* Time management disclaimer per prompt guidelines */}
          <div className="p-3 bg-ivory-100 rounded-lg border border-gold-200/50 flex items-start gap-2.5 text-xs text-stone-600">
            <ShieldAlert className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-maroon-900 font-semibold">Consultation Policy:</strong> The consultation duration is strictly {durationMinutes} minutes. Standard Zoom rooms do not forcibly terminate links upon duration expiry, so participants must honor the platform timer to allow timely guidance for all seekers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationTimer;
