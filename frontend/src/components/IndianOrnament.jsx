import React from 'react';

export const IndianOrnament = ({ className = 'w-6 h-6 text-gold-500' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L14.2 8.5L21 8.5L15.6 12.8L17.8 19.3L12 15.2L6.2 19.3L8.4 12.8L3 8.5L9.8 8.5L12 2Z" fillOpacity="0.85" />
      <circle cx="12" cy="12" r="3" fill="#FAF7F2" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};

export const VedicDivider = ({ text = '' }) => {
  return (
    <div className="flex items-center justify-center my-6 gap-3">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold-400/50 to-gold-400" />
      <div className="flex items-center gap-2 px-3 py-1 bg-ivory-200/60 rounded-full border border-gold-400/30 text-xs font-serif text-maroon-700 tracking-wider">
        <IndianOrnament className="w-3.5 h-3.5 text-gold-600" />
        {text && <span>{text}</span>}
        <IndianOrnament className="w-3.5 h-3.5 text-gold-600" />
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold-400/50 to-gold-400" />
    </div>
  );
};
