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
  const [isHovered, setIsHovered] = useState(false);

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
    <div 
      className="relative bg-gradient-to-br from-[#fef5cd] to-[#f4e296] border border-[#e3ce84] rounded-sm p-5 sm:p-6 mb-8 text-amber-950 select-none overflow-hidden transition-all duration-500 cursor-pointer"
      style={{ 
        boxShadow: isHovered ? '0 15px 40px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.1)',
        transform: isHovered ? 'rotate(0deg)' : 'rotate(1deg)' 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Decorative Washi Tape */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#e5c276]/90 shadow-xs rotate-[-2deg] pointer-events-none"
        style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
      />

      {/* Folded Corner (Dog Ear) */}
      <div 
        className={`absolute top-0 right-0 w-[40px] h-[40px] bg-[#d9c47c] transition-all duration-500 origin-top-right rounded-bl-sm z-10 ${
          isHovered ? 'opacity-0 scale-50 translate-x-2 -translate-y-2' : 'opacity-100 scale-100 shadow-[-3px_3px_8px_rgba(0,0,0,0.15)]'
        }`}
        style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
      />
      {/* Background corner cut to reveal page background behind it (pseudo-transparency hack via bg color match) */}
      <div 
        className={`absolute top-0 right-0 w-[41px] h-[41px] bg-[#ebe4d1] transition-all duration-500 origin-top-right z-0 ${
          isHovered ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
        style={{ clipPath: 'polygon(100% 0, 0 0, 0 100%)' }}
      />

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all duration-500 ${isHovered ? 'pb-4 border-b border-amber-700/20 mb-4' : ''}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#c93b2b] text-white text-[10px] font-black uppercase tracking-wider rounded-xs shadow-sm">
              Priority 2 · Agenda
            </span>
            <span className={`text-xs text-amber-800 font-handwritten text-base transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 hidden sm:inline-block'}`}>
              today&apos;s sticky note
            </span>
            {!isHovered && (
               <span className="text-xs text-[#c93b2b] font-bold ml-2 animate-pulse flex items-center gap-0.5 bg-red-100/50 px-2 py-0.5 rounded-full border border-red-200">
                 Hover to unfold <ChevronRight className="w-3.5 h-3.5" />
               </span>
            )}
          </div>
          <h3 className="font-editorial text-2xl font-bold text-amber-950 mt-0.5">
            My Plan Today · {todayDayName}
          </h3>
        </div>

        {isAuthenticated && isHovered && (
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentTab('my-plan'); }}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 animate-fade-in"
          >
            <span>Open Full Week Planner</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Foldable Content */}
      <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isHovered ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
      {!isAuthenticated ? (
        <div className="py-8 px-4 text-center bg-amber-50/50 border border-dashed border-amber-300 rounded-xs">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3 border border-amber-200">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="font-editorial text-lg font-bold text-amber-950">
            Sign In to Unlock &ldquo;My Plan Today&rdquo;
          </h4>
          <p className="text-xs text-amber-800 max-w-sm mx-auto mt-1 mb-4 font-sans-ui">
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
        <div className="py-6 text-center text-xs text-amber-800 bg-amber-50/50 rounded-xs border border-amber-200">
          <p className="font-editorial text-base text-amber-950 mb-1 font-bold">Your Schedule is Clear for Today!</p>
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
                    ? 'bg-white/60 border-amber-200 text-amber-950'
                    : 'bg-white border-amber-300 text-amber-950 shadow-md cursor-pointer hover:border-amber-400 hover:shadow-lg'
                }`}
              >
                {/* Time Badge & Title */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="px-2.5 py-1 bg-amber-100 border border-amber-200 rounded-xs font-mono text-xs text-amber-900 font-bold shrink-0">
                    {item.timeStart} - {item.timeEnd}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider shadow-sm ${
                        isClass
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-[#c93b2b] text-white'
                      }`}>
                        {item.categoryOrCourse}
                      </span>
                    </div>
                    <h4 className="font-editorial text-base font-bold text-amber-950 mt-0.5">
                      {item.title}
                    </h4>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-amber-700 shrink-0 font-sans-ui font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#c93b2b]" />
                  <span>{item.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      </div>
    </div>
  );
};
