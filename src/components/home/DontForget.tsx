'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AlertCircle, Clock, ExternalLink, Calendar, MapPin, Sparkles } from 'lucide-react';

export const DontForget: React.FC = () => {
  const { events, openEventDetail } = useApp();

  // Find the single most urgent registration deadline among upcoming events
  const urgentEvent = events
    .filter((e) => e.registration_deadline && e.status === 'Upcoming')
    .sort((a, b) => {
      const dateA = new Date(a.registration_deadline!).getTime();
      const dateB = new Date(b.registration_deadline!).getTime();
      return dateA - dateB;
    })[0];

  if (!urgentEvent) return null;

  return (
    <div className="relative w-full my-6 select-none animate-fade-in">
      {/* Red paper-slip module with pinned edges */}
      <div 
        className="relative bg-gradient-to-r from-[#9e271a] via-[#b92b1b] to-[#c93b2b] text-amber-50 rounded-sm p-4 sm:p-5 shadow-2xl border-t-2 border-b-2 border-red-300/40 overflow-hidden"
        style={{
          boxShadow: '0 8px 24px rgba(185, 43, 27, 0.45)',
        }}
      >
        {/* Washi tape on left & right edges to affix paper slip */}
        <div 
          className="absolute -top-2 left-4 w-16 h-5 bg-[#f3da90]/80 shadow-xs rotate-[-3deg] pointer-events-none"
          style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
        />
        <div 
          className="absolute -top-2 right-4 w-16 h-5 bg-[#f3da90]/80 shadow-xs rotate-[3deg] pointer-events-none"
          style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left info block */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-300 text-neutral-950 font-black text-[10px] tracking-wider uppercase rounded-xs shadow-xs">
                Priority 1 · Don&apos;t Forget!
              </span>
              <span className="text-xs text-amber-200 font-handwritten text-base">
                most urgent deadline on campus
              </span>
            </div>

            <h3 
              onClick={() => openEventDetail(urgentEvent)}
              className="font-editorial text-xl sm:text-2xl font-black text-white hover:text-amber-200 cursor-pointer transition-colors leading-tight truncate"
            >
              {urgentEvent.event_name}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-100/90 font-sans-ui">
              <div className="flex items-center gap-1 font-semibold text-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Closing: {urgentEvent.registration_deadline}</span>
              </div>
              <span className="opacity-40">|</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Event Date: {urgentEvent.date}</span>
              </div>
              <span className="opacity-40">|</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{urgentEvent.venue_zone}</span>
              </div>
            </div>
          </div>

          {/* Right Action Button: Direct CTA to Google registration */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => openEventDetail(urgentEvent)}
              className="px-3.5 py-2.5 bg-black/25 hover:bg-black/40 text-amber-200 text-xs font-semibold rounded-xs border border-amber-200/30 transition-colors"
            >
              Read Details
            </button>

            {urgentEvent.registration_link ? (
              <a
                href={urgentEvent.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-amber-300 hover:bg-amber-200 text-neutral-950 font-black text-xs sm:text-sm rounded-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Register Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={() => openEventDetail(urgentEvent)}
                className="px-5 py-2.5 bg-amber-300 hover:bg-amber-200 text-neutral-950 font-black text-xs sm:text-sm rounded-xs shadow-lg transition-transform active:scale-95"
              >
                View Registration Info
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
