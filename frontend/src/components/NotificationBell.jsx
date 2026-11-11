import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isExecutive } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificationsUrl = isExecutive ? '/executive/notifications' : '/dashboard/notifications';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-maroon-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden animate-in fade-in duration-150">
          <div className="px-4 py-3 bg-ivory-100 border-b border-stone-200 flex items-center justify-between">
            <span className="text-sm font-serif font-semibold text-maroon-900">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-gold-700 hover:text-gold-900 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No notifications right now.
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n._id}
                  className={`p-3 text-xs transition-colors ${
                    n.read ? 'bg-white text-stone-600' : 'bg-gold-50/40 text-stone-800 font-medium'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-semibold text-stone-900">{n.title}</h5>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-stone-400 hover:text-stone-700 p-0.5"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-stone-600 mt-0.5 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 text-center">
            <Link
              to={notificationsUrl}
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-maroon-700 hover:text-maroon-900"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
