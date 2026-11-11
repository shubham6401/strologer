import React from 'react';

export const PaymentStatusBadge = ({ status }) => {
  switch (status) {
    case 'PAYMENT_VERIFIED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          Verified
        </span>
      );
    case 'UNDER_VERIFICATION':
    case 'SCREENSHOT_SUBMITTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          Under Verification
        </span>
      );
    case 'PAYMENT_REJECTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
          Rejected
        </span>
      );
    case 'PAYMENT_PENDING':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
          Payment Pending
        </span>
      );
  }
};

export const BookingStatusBadge = ({ status }) => {
  switch (status) {
    case 'SCHEDULED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
          Scheduled
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          Completed
        </span>
      );
    case 'PAYMENT_VERIFIED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
          Payment Confirmed
        </span>
      );
    case 'PAYMENT_SUBMITTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Proof Submitted
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
          Cancelled
        </span>
      );
    case 'CREATED':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
          Initiated
        </span>
      );
  }
};
