import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserLogin = () => {
  const { userLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await userLogin(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Pass@123');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-maroon-800 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-maroon-900">
            Client Portal Sign In
          </h2>
          <p className="text-xs text-stone-500">
            Sign in to track your consultation bookings, view payment statuses, and attend Zoom meetings.
          </p>
        </div>

        {/* Astrologer Executive Notice */}
        <div className="p-3 rounded-xl bg-ivory-100 border border-gold-300/50 text-[11px] text-stone-600 flex items-center justify-between">
          <span>Are you a practicing Astrologer?</span>
          <Link to="/executive/login" className="font-semibold text-maroon-800 hover:text-maroon-950 underline">
            Astrologer Login →
          </Link>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Your Registered Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-gold-700 hover:text-gold-900 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In to Client Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Development Demo Quick Fill */}
        <div className="pt-4 border-t border-stone-100">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-2 text-center">
            Development Quick-Fill Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('user1@example.com')}
              className="py-1.5 px-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700 text-left"
            >
              <strong className="block text-maroon-900">User 1</strong>
              <span>Vikramaditya</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('user2@example.com')}
              className="py-1.5 px-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700 text-left"
            >
              <strong className="block text-maroon-900">User 2</strong>
              <span>Priya Sundaram</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-stone-600">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-maroon-800 hover:text-maroon-950 underline"
          >
            Create Free Client Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
