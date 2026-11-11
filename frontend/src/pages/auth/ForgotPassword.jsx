import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSubmitted(true);
        if (res.data.devResetToken) {
          setDevToken(res.data.devResetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-maroon-800 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-maroon-900">
            Reset Your Password
          </h2>
          <p className="text-xs text-stone-500">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <strong className="block font-semibold">Instructions Dispatched</strong>
                If an account exists with {email}, instructions have been prepared.
              </div>
            </div>

            {devToken && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <span className="font-semibold text-amber-900 block">Development Mode Reset Token:</span>
                <code className="block p-2 bg-white rounded border border-amber-300 font-mono text-[11px] break-all">
                  {devToken}
                </code>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="inline-block px-4 py-1.5 rounded-lg bg-maroon-700 text-white font-semibold text-xs"
                >
                  Proceed to Reset Password →
                </Link>
              </div>
            )}

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-semibold text-maroon-800 hover:text-maroon-950">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <span>Processing...</span> : <span>Send Reset Instructions</span>}
            </button>

            <div className="text-center pt-2 text-xs text-stone-500">
              Remember your password?{' '}
              <Link to="/login" className="font-semibold text-maroon-800 hover:text-maroon-950">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
