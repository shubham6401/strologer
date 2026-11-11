import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const CustomerNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-maroon-900">
            Consultation Notifications
          </h2>
          <p className="text-xs text-stone-500">
            Updates on payment verification, meeting schedules, and consultation status.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-maroon-900 text-xs font-semibold transition-colors"
          >
            Mark all ({unreadCount}) as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-stone-500 text-xs space-y-2">
            <Bell className="w-10 h-10 text-stone-300 mx-auto" />
            <p>You have no notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 transition-colors flex items-start justify-between gap-4 ${
                  n.read ? 'bg-white' : 'bg-gold-50/50'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm text-stone-900">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-maroon-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {n.relatedBookingId && (
                    <Link
                      to={`/payment/${n.relatedBookingId}`}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-[11px] font-semibold text-maroon-800"
                    >
                      View Details
                    </Link>
                  )}
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerNotifications;
