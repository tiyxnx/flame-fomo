'use client';

import React, { useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { EventCard } from '../EventCard';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

export const HappeningSoon: React.FC = () => {
  const { events } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter events happening soon (upcoming or within next 3 days)
  const upcomingEvents = events.filter((e) => e.status !== 'Cancelled').slice(0, 7);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-10 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#e25845] text-white text-[10px] font-black uppercase tracking-wider rounded-xs">
              Priority 3 · Radar
            </span>
            <span className="text-xs text-[#a89b87] font-handwritten text-base">
              swipe horizontally
            </span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f5ebd7] mt-0.5 flex items-center gap-2">
            <span>Happening Soon</span>
            <Flame className="w-5 h-5 text-[#e25845]" />
          </h3>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-[#2a251e] border border-[#443a2e] text-neutral-300 hover:text-white hover:bg-[#383126] transition-colors"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-[#2a251e] border border-[#443a2e] text-neutral-300 hover:text-white hover:bg-[#383126] transition-colors"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto custom-scrollbar pb-6 pt-3 px-1 -mx-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {upcomingEvents.map((evt, idx) => (
          <div
            key={evt.id}
            className="shrink-0 w-72 sm:w-80"
            style={{ scrollSnapAlign: 'start' }}
          >
            <EventCard event={evt} rotationIndex={idx} />
          </div>
        ))}
      </div>

    </div>
  );
};
