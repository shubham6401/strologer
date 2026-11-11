import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CalendarCheck,
  CreditCard,
  Video,
  History,
  User,
  Bell,
  LogOut,
  Compass,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore Astrologers', path: '/astrologers', icon: Search },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: CalendarCheck },
    { name: 'Pending Payments', path: '/dashboard/pending-payments', icon: CreditCard },
    { name: 'Upcoming Consultations', path: '/dashboard/upcoming', icon: Video },
    { name: 'Consultation History', path: '/dashboard/history', icon: History },
    { name: 'Birth Chart & Profile', path: '/dashboard/profile', icon: User },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row text-stone-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-maroon-900 text-white px-4 py-3 flex items-center justify-between border-b border-gold-600/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md hover:bg-maroon-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-serif font-bold text-lg text-gold-400">Client Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="w-7 h-7 rounded-full bg-gold-500 text-maroon-950 font-bold text-xs flex items-center justify-center overflow-hidden">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white text-stone-800 border-r border-stone-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand in Customer Sidebar */}
        <div className="p-6 border-b border-stone-200 bg-ivory-100/70 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-maroon-800 text-gold-400 border border-gold-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-maroon-900 text-base block leading-tight">
                Jyotishya Vani
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                Client Sanctuary
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer User Info Card */}
        <div className="p-4 mx-3 my-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-maroon-700 text-white font-bold text-sm flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-serif font-semibold text-stone-900 truncate">{user?.name}</h4>
              <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Primary CTA in sidebar */}
        <div className="px-3 pb-2">
          <Link
            to="/astrologers"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Consultation</span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-ivory-200 text-maroon-900 border-l-4 border-gold-600 font-semibold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-gold-600" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-stone-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-stone-200">
          <div>
            <h2 className="text-xl font-serif font-bold text-maroon-900">
              Welcome, {user?.name}
            </h2>
            <p className="text-xs text-stone-500">
              Track your astrology consultations, upload payment screenshots, and access Zoom meeting rooms.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/astrologers"
              className="text-xs text-maroon-800 font-semibold px-3 py-1.5 rounded-lg border border-gold-300 bg-gold-50 hover:bg-gold-100 transition-colors"
            >
              Explore Astrologers
            </Link>

            <NotificationBell />

            <div className="h-6 w-px bg-stone-200" />

            <span className="text-xs font-medium text-stone-600">Client Portal</span>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
