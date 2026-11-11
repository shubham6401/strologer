import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, isExecutive, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Astrologers', path: '/astrologers' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro bar for auspicious touch */}
      <div className="bg-maroon-900 text-ivory-100 text-[11px] py-1 px-4 text-center tracking-wider font-serif border-b border-gold-600/30 flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-gold-400" />
        <span>Authentic Vedic Consultations • 100% Confidential • Manual UPI Verification</span>
        <Sparkles className="w-3 h-3 text-gold-400" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-maroon-800 text-gold-400 border border-gold-500/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-maroon-900 tracking-tight leading-none">
                Jyotishya Vani
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-gold-700 font-medium">
                Vedic Astrology Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `transition-colors hover:text-maroon-800 py-1 ${
                    isActive
                      ? 'text-maroon-800 font-semibold border-b-2 border-gold-500'
                      : 'text-stone-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <NotificationBell />

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-stone-200 bg-ivory-100 hover:bg-ivory-200/70 transition-colors text-sm font-medium text-stone-800"
                  >
                    <div className="w-7 h-7 rounded-full bg-maroon-700 text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in duration-100">
                      <div className="px-4 py-2 border-b border-stone-100 text-xs">
                        <span className="text-stone-500 block">Signed in as</span>
                        <span className="font-semibold text-stone-800 block truncate">{user.email}</span>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-maroon-50 text-maroon-700">
                          {isExecutive ? 'Astrologer Executive' : 'Client Account'}
                        </span>
                      </div>

                      <Link
                        to={isExecutive ? '/executive/dashboard' : '/dashboard'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-maroon-800 font-medium"
                      >
                        {isExecutive ? 'Executive Dashboard' : 'My Consultations'}
                      </Link>

                      <Link
                        to={isExecutive ? '/executive/profile' : '/dashboard/profile'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-maroon-800"
                      >
                        Profile Settings
                      </Link>

                      <div className="border-t border-stone-100 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to={isExecutive ? '/executive/dashboard' : '/astrologers'}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-maroon-700 hover:bg-maroon-800 text-white shadow-sm transition-all"
                >
                  {isExecutive ? 'Open Dashboard' : 'Book Consultation'}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/executive/login"
                  className="text-xs text-stone-500 hover:text-maroon-800 font-medium px-2 py-1 rounded"
                  title="Astrologer portal access"
                >
                  Astrologer Login
                </Link>

                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  Client Sign In
                </Link>

                <Link
                  to="/astrologers"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-maroon-700 hover:bg-maroon-800 text-white shadow-sm hover:shadow transition-all"
                >
                  Book Consultation
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-stone-800 hover:bg-ivory-100 hover:text-maroon-800"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-stone-200 pt-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isExecutive ? '/executive/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg font-semibold bg-maroon-700 text-white"
                >
                  {isExecutive ? 'Executive Dashboard' : 'My Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center px-4 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/astrologers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg font-semibold bg-maroon-700 text-white shadow"
                >
                  Book Consultation
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-3 py-2 rounded-lg text-sm border border-stone-300 text-stone-700 font-medium"
                  >
                    Client Login
                  </Link>
                  <Link
                    to="/executive/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-3 py-2 rounded-lg text-sm border border-gold-300 bg-gold-50/50 text-gold-900 font-medium"
                  >
                    Astrologer Portal
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
