'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ExternalLink, CheckCircle2, X, AlertCircle } from 'lucide-react';

export const ExternalRegModal: React.FC = () => {
  const { externalRegEvent: event, closeExternalRegModal } = useApp();

  if (!event || !event.registration_link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#fdfaf2] text-neutral-900 rounded-sm shadow-2xl border-4 border-[#e5dec9] p-6 text-center select-none"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
        }}
      >
        {/* Washi tape accent */}
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#a2d9ce]/80 shadow-sm backdrop-blur-xs rotate-[-2deg] pointer-events-none"
          style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
        />

        {/* Close icon */}
        <button
          onClick={closeExternalRegModal}
          className="absolute top-3 right-3 p-1.5 rounded-full text-neutral-500 hover:bg-neutral-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success / Warning icon */}
        <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-300 mt-2 mb-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>

        <h3 className="font-editorial text-xl font-bold text-neutral-900 mb-1">
          Added to Your Campus Plan!
        </h3>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-left mb-5 mt-3">
          <div className="flex items-start gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">Important Registration Reminder:</span> Marking <span className="font-semibold">&ldquo;I&apos;m Going&rdquo;</span> pins this event to your personal planner & campus map, but does <em>not</em> register your official seat. Please complete the organizer&apos;s registration link below!
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeExternalRegModal}
            className="w-full py-3 px-4 bg-[#c93b2b] hover:bg-[#b02e20] text-amber-100 text-sm font-bold rounded-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Complete Official Registration</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={closeExternalRegModal}
            className="w-full py-2 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
          >
            I&apos;ll register later
          </button>
        </div>

      </div>
    </div>
  );
};
