import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BadgeIndianRupee,
  QrCode,
  CalendarCheck,
  CheckCircle2,
  Calendar,
  History,
  TrendingUp,
  Clock,
  Video,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const ExecutiveLayout = () => {
  const { user, profile, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/executive/login');
  };

  const navItems = [
    { name: 'Overview', path: '/executive/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/executive/profile', icon: User },
    { name: 'Consultation Pricing', path: '/executive/pricing', icon: BadgeIndianRupee },
    { name: 'Payment QR Management', path: '/executive/payment-qr', icon: QrCode },
    { name: 'Booking Requests', path: '/executive/booking-requests', icon: CalendarCheck },
    { name: 'Payment Verification', path: '/executive/payment-verification', icon: CheckCircle2 },
    { name: 'Scheduled Consultations', path: '/executive/scheduled-consultations', icon: Calendar },
    { name: 'Consultation History', path: '/executive/history', icon: History },
    { name: 'Earnings & Revenue', path: '/executive/earnings', icon: TrendingUp },
    { name: 'Availability Settings', path: '/executive/availability', icon: Clock },
    { name: 'Zoom Settings', path: '/executive/zoom-settings', icon: Video },
    { name: 'Notifications', path: '/executive/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row text-stone-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-maroon-900 text-white px-4 py-3 flex items-center justify-between border-b border-gold-600/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-maroon-800"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-serif font-bold text-lg text-gold-400">Astrologer Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="w-7 h-7 rounded-full bg-gold-500 text-maroon-950 font-bold text-xs flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'A'
            )}
          </div>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Off-canvas */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-charcoal-900 text-stone-200 border-r border-charcoal-800 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand in Sidebar */}
        <div className="p-6 border-b border-charcoal-800 bg-charcoal-900/90 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-maroon-800 text-gold-400 border border-gold-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base block leading-tight">
                Jyotishya Vani
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gold-500 font-semibold">
                Executive Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Profile Card preview in sidebar */}
        <div className="p-4 mx-3 my-3 bg-charcoal-800/80 rounded-xl border border-charcoal-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-maroon-700 border-2 border-gold-500/50 overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'E'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-serif font-semibold text-white truncate">{user?.name}</h4>
              <p className="text-[11px] text-gold-400 truncate">{profile?.title || 'Astrologer'}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>₹{profile?.pricePerMinute || 20}/min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-maroon-800/90 text-gold-300 border-l-4 border-gold-500 font-semibold'
                      : 'text-stone-300 hover:bg-charcoal-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-gold-500/80" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-charcoal-800 space-y-1">
          <Link
            to={`/astrologers/${user?.id}`}
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-stone-400 hover:bg-charcoal-800 hover:text-gold-400"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Profile</span>
            </span>
            <span className="text-[10px] bg-charcoal-700 px-1.5 py-0.5 rounded">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-stone-200">
          <div>
            <h2 className="text-xl font-serif font-bold text-maroon-900">Astrologer Executive Console</h2>
            <p className="text-xs text-stone-500">
              Manage client booking inquiries, verify payments, and conduct Zoom consultations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/astrologers"
              className="text-xs text-stone-600 hover:text-maroon-800 flex items-center gap-1 font-medium px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Directory</span>
            </Link>

            <NotificationBell />

            <div className="h-6 w-px bg-stone-200" />

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
              <span>{user?.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-maroon-100 text-maroon-800">
                Executive
              </span>
            </div>
          </div>
        </header>

        {/* Routed Page Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ExecutiveLayout;
