'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BellRing, X } from 'lucide-react';

export const InAppReminder: React.FC = () => {
  const { user, isAuthenticated, events, goingEventIds, openEventDetail } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dismissedItems, setDismissedItems] = useState<string[]>([]);

  useEffect(() => {
    // Check every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated || !user) return null;

  const todayDateString = currentTime.toISOString().split('T')[0];
  const currentH = currentTime.getHours();
  const currentM = currentTime.getMinutes();
  const currentTotalM = currentH * 60 + currentM;

  let upcomingAlert: any = null;

  for (const goingId of goingEventIds) {
    if (dismissedItems.includes(goingId)) continue;

    const evt = events.find((e) => e.id === goingId);
    if (evt && evt.date === todayDateString) {
      const start = evt.time_start || evt.time_start_end.split('-')[0]?.trim() || '18:00';
      
      const timeMatch = start.match(/(\d+):(\d+)/);
      if (timeMatch) {
        let h = parseInt(timeMatch[1]);
        let m = parseInt(timeMatch[2]);
        if (start.toLowerCase().includes('pm') && h < 12) h += 12;
        if (start.toLowerCase().includes('am') && h === 12) h = 0;
        
        const startTotalM = h * 60 + m;
        const diffM = startTotalM - currentTotalM;
        
        // Alert if starting in exactly 30 minutes, or if it's within the 30min window
        if (diffM > 0 && diffM <= 30) {
          upcomingAlert = { ...evt, diffM };
          break; // Show one alert at a time
        }
      }
    }
  }

  if (!upcomingAlert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="relative bg-[#c93b2b] text-white p-4 rounded shadow-2xl border-2 border-red-400 w-72 sm:w-80">
        
        {/* Push Pin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-red-800 shadow-md">
          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>

        <button 
          onClick={() => setDismissedItems([...dismissedItems, upcomingAlert.id])}
          className="absolute top-2 right-2 p-1 text-red-200 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mt-1">
          <BellRing className="w-5 h-5 text-amber-300 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-bold text-sm leading-tight text-amber-100">
              Starts in {upcomingAlert.diffM} minutes!
            </h4>
            <p className="text-xs mt-1 font-semibold line-clamp-2">
              {upcomingAlert.event_name}
            </p>
            <p className="text-[10px] text-red-200 mt-0.5 uppercase tracking-wider font-bold">
              📍 {upcomingAlert.venue_zone}
            </p>
            <button
              onClick={() => openEventDetail(upcomingAlert)}
              className="mt-2 text-[10px] font-bold bg-white text-red-700 px-2 py-1 rounded shadow-sm hover:bg-red-50"
            >
              View Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
