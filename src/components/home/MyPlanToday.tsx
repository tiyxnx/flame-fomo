'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'class' | 'event';
  title: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  categoryOrCourse: string;
  originalEventId?: string;
}

export const MyPlanToday: React.FC<{ eventsProp?: import('@/types').EventItem[] }> = ({ eventsProp }) => {
  const { 
    user, 
    isAuthenticated, 
    events: contextEvents, 
    goingEventIds, 
    openAuthModal, 
    openEventDetail,
    setCurrentTab 
  } = useApp();
  
  const events = eventsProp || contextEvents;

  const [todayDateString, setTodayDateString] = useState('2026-10-07');
  const [todayDayName, setTodayDayName] = useState<'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Wednesday');

  useEffect(() => {
    const today = new Date();
    setTodayDateString(today.toISOString().split('T')[0]);
    const dayNames: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    setTodayDayName(dayNames[today.getDay()]);
  }, []);

  // If user is authenticated, compile items
  const timelineItems: TimelineItem[] = [];

  if (isAuthenticated && user) {
    // 1. Add academic classes for today
    for (const cls of user.academic_timetable || []) {
      if (cls.day === todayDayName) {
        timelineItems.push({
          id: cls.id,
          type: 'class',
          title: cls.courseName,
          timeStart: cls.timeStart,
          timeEnd: cls.timeEnd,
          location: cls.room || cls.venueZone || 'Academics',
          categoryOrCourse: 'Academic Class',
        });
      }
    }

    // 2. Add events user is going to today
    for (const goingId of goingEventIds) {
      const evt = events.find((e) => e.id === goingId);
      if (evt && evt.date === todayDateString) {
        const start = evt.time_start || evt.time_start_end.split('-')[0]?.trim() || '18:00';
        const end = evt.time_end || evt.time_start_end.split('-')[1]?.trim() || '20:00';
        timelineItems.push({
          id: evt.id,
          type: 'event',
          title: evt.event_name,
          timeStart: start,
          timeEnd: end,
          location: `${evt.venue_zone}${evt.room_specific ? ` · ${evt.room_specific}` : ''}`,
          categoryOrCourse: evt.category,
          originalEventId: evt.id,
        });
      }
    }

    // Sort chronologically by start time
    timelineItems.sort((a, b) => a.timeStart.localeCompare(b.timeStart));
  }

  return (
    <div className="relative bg-[#201c18] border border-[#3b3327] rounded-sm p-5 sm:p-6 shadow-xl mb-8 text-neutral-100 select-none">
      
      {/* Decorative Washi Tape */}
      <div 
        className="absolute -top-3 left-8 w-24 h-5 bg-[#f3da90]/80 shadow-xs rotate-[-2deg] pointer-events-none"
        style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#383025] mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#f3da90] text-neutral-950 text-[10px] font-black uppercase tracking-wider rounded-xs">
              Priority 2 · Day Planner
            </span>
            <span className="text-xs text-[#a89a83] font-handwritten text-base">
              today&apos;s schedule
            </span>
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#f5ebd7] mt-0.5">
            My Plan Today · {todayDayName}
          </h3>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setCurrentTab('my-plan')}
            className="text-xs font-semibold text-amber-200 hover:text-amber-100 flex items-center gap-1"
          >
            <span>Open Full Week Planner</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      {!isAuthenticated ? (
        <div className="py-8 px-4 text-center bg-[#29241e] border border-dashed border-[#473e31] rounded-xs">
          <div className="mx-auto w-12 h-12 bg-amber-950/60 text-amber-300 rounded-full flex items-center justify-center mb-3 border border-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="font-editorial text-lg font-bold text-amber-100">
            Sign In to Unlock &ldquo;My Plan Today&rdquo;
          </h4>
          <p className="text-xs text-[#a89b87] max-w-sm mx-auto mt-1 mb-4 font-sans-ui">
            Connect your FLAME student email to automatically merge your daily academic lectures with campus club events and performances.
          </p>
          <button
            onClick={() => openAuthModal('Sign in with your FLAME email to view your personalized daily schedule.')}
            className="px-5 py-2 bg-[#c93b2b] hover:bg-[#b02e20] text-amber-100 text-xs font-bold rounded-xs shadow transition-transform active:scale-95"
          >
            Student Sign In (@flame.edu.in)
          </button>
        </div>
      ) : timelineItems.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#a89b87] bg-[#29241e] rounded-xs border border-[#3b3327]">
          <p className="font-editorial text-base text-amber-200 mb-1">Your Schedule is Clear for Today!</p>
          <p>No lectures or committed events scheduled today. Check out upcoming events below to fill your evening.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {timelineItems.map((item, index) => {
            const isClass = item.type === 'class';
            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => {
                  if (item.originalEventId) {
                    const evt = events.find((e) => e.id === item.originalEventId);
                    if (evt) openEventDetail(evt);
                  }
                }}
                className={`p-3 sm:p-3.5 rounded-xs border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isClass
                    ? 'bg-[#26221d] border-[#42382b] text-neutral-200'
                    : 'bg-[#2e261f] border-amber-500/40 text-amber-100 shadow-md cursor-pointer hover:border-amber-400'
                }`}
              >
                {/* Time Badge & Title */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="px-2.5 py-1 bg-black/40 border border-white/10 rounded-xs font-mono text-xs text-amber-200 shrink-0">
                    {item.timeStart} - {item.timeEnd}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider ${
                        isClass
                          ? 'bg-blue-900/60 text-blue-200 border border-blue-700/50'
                          : 'bg-[#c93b2b] text-white'
                      }`}>
                        {item.categoryOrCourse}
                      </span>
                    </div>
                    <h4 className="font-editorial text-base font-bold text-neutral-100 mt-0.5">
                      {item.title}
                    </h4>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-[#b8ab96] shrink-0 font-sans-ui">
                  <MapPin className="w-3.5 h-3.5 text-[#e25845]" />
                  <span>{item.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
