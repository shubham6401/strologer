import React, { useState, useEffect } from 'react';
import { TrendingUp, BadgeIndianRupee, Clock, CheckCircle2, XCircle, Calendar, ShieldCheck, Download } from 'lucide-react';
import api from '../../services/api';

const EarningsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get('/executive/earnings');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Failed to load earnings summary:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const { stats, monthlyBreakdown, recentTransactions } = data || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Financial Earnings & Revenue Ledger
        </h2>
        <p className="text-xs text-stone-500">
          Transparent breakdown of gross verified payments, net payout disbursements, and monthly revenue performance.
        </p>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Gross Verified Payments</span>
            <BadgeIndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-maroon-900">
            ₹{stats?.totalVerifiedGross || 0}
          </div>
          <p className="text-[11px] text-stone-500">
            Total funds manually verified and confirmed via your personal UPI QR.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Net Consultant Earnings</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-purple-950">
            ₹{stats?.netEarnings || 0}
          </div>
          <p className="text-[11px] text-stone-500">
            Disbursable after {stats?.platformCommissionPercent || 10}% platform tech fee.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Pending In Verification</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-700">
            ₹{stats?.pendingValue || 0}
          </div>
          <p className="text-[11px] text-stone-500">
            {stats?.pendingVerificationCount || 0} booking request(s) awaiting verification.
          </p>
        </div>
      </div>

      {/* Operational Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">Total Consultations</span>
          <span className="text-xl font-serif font-bold text-stone-900">{stats?.totalBookingsCount || 0}</span>
        </div>
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">Completed</span>
          <span className="text-xl font-serif font-bold text-emerald-700">{stats?.completedCount || 0}</span>
        </div>
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">Scheduled</span>
          <span className="text-xl font-serif font-bold text-purple-700">{stats?.scheduledCount || 0}</span>
        </div>
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">Cancelled</span>
          <span className="text-xl font-serif font-bold text-rose-700">{stats?.cancelledCount || 0}</span>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-maroon-900">
            Monthly Revenue Ledger
          </h3>
          <span className="text-xs text-stone-500">Historical performance breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-6 py-3">Month & Year</th>
                <th className="px-6 py-3">Completed Sessions</th>
                <th className="px-6 py-3">Gross Verified</th>
                <th className="px-6 py-3">Platform Fee (10%)</th>
                <th className="px-6 py-3 text-right">Net Astrologer Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(!monthlyBreakdown || monthlyBreakdown.length === 0) ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-stone-500">
                    No monthly earnings recorded yet.
                  </td>
                </tr>
              ) : (
                monthlyBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="px-6 py-3.5 font-semibold text-stone-900">{row.month}</td>
                    <td className="px-6 py-3.5 text-stone-600">{row.consultations} sessions</td>
                    <td className="px-6 py-3.5 font-serif font-bold text-stone-900">₹{row.gross}</td>
                    <td className="px-6 py-3.5 text-stone-500">₹{Math.round(row.gross * 0.1)}</td>
                    <td className="px-6 py-3.5 text-right font-serif font-bold text-emerald-800 text-sm">
                      ₹{row.net}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;
