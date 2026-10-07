'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Bookmark, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Users, 
  Share2 
} from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const {
    selectedEventForDetail: event,
    closeEventDetail,
    isAuthenticated,
    savedEventIds,
    goingEventIds,
    favouriteCategories,
    toggleSaveEvent,
    toggleGoingEvent,
    toggleFavouriteCategory,
    openAuthModal,
    setCurrentTab,
  } = useApp();

  if (!event) return null;

  const isSaved = savedEventIds.includes(event.id);
  const isGoing = goingEventIds.includes(event.id);
  const isFav = favouriteCategories.includes(event.category);
  const isCancelled = event.status === 'Cancelled';

  const handleAction = (type: 'going' | 'save' | 'fav') => {
    if (!isAuthenticated) {
      openAuthModal('Sign in with your FLAME email to save this event and build your plan.');
      return;
    }
    if (type === 'going') toggleGoingEvent(event.id);
    if (type === 'save') toggleSaveEvent(event.id);
    if (type === 'fav') toggleFavouriteCategory(event.category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fcfbf7] text-neutral-900 rounded-sm shadow-2xl border-4 border-[#e5dec9] p-5 sm:p-7"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 40px rgba(220,205,180,0.3)',
        }}
      >
        {/* Washi tape at top */}
        <div 
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#f3da90]/90 shadow-md backdrop-blur-xs rotate-1 z-20 pointer-events-none"
          style={{ clipPath: 'polygon(2% 0%, 98% 3%, 100% 97%, 0% 95%)' }}
        />

        {/* Close Button */}
        <button
          onClick={closeEventDetail}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-[#1a1714] text-amber-200 text-xs font-bold uppercase tracking-wider rounded-xs">
            {event.category}
          </span>
          <span className="text-xs text-neutral-500 font-handwritten text-base">
            organized by {event.organizer}
          </span>
          {isCancelled && (
            <span className="px-2.5 py-0.5 bg-red-100 border border-red-400 text-red-700 text-xs font-bold uppercase rounded-xs">
              Event Cancelled
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight mb-4">
          {event.event_name}
        </h2>

        {/* Visual photo if present */}
        {event.event_image && (
          <div className="relative w-full h-56 sm:h-64 rounded-sm overflow-hidden mb-5 border border-neutral-300 shadow-md">
            <img
              src={event.event_image}
              alt={event.event_name}
              className="w-full h-full object-cover"
            />
            {event.registration_deadline && !isCancelled && (
              <div className="absolute top-3 right-3">
                <span className="stamp-urgent text-xs">
                  Deadline: {event.registration_deadline}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Grid of Key Event Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#f4eee1] rounded-sm border border-[#e2d6be] mb-5 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#c93b2b]" />
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Date</p>
              <p className="font-bold text-neutral-900">{event.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#c93b2b]" />
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Time Slot</p>
              <p className="font-bold text-neutral-900">{event.time_start_end}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#c93b2b]" />
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Venue & Zone</p>
              <p className="font-bold text-neutral-900">
                {event.venue_zone} {event.room_specific ? `· ${event.room_specific}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#c93b2b]" />
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Target Cohort / Eligibility</p>
              <p className="font-bold text-neutral-900">
                {event.requirements_eligibility || 'Open to All FLAME Students'}
              </p>
            </div>
          </div>
        </div>

        {/* Description paragraph */}
        <div className="mb-6">
          <h4 className="font-editorial text-sm font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            About this Event
          </h4>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans-ui whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* External Registration Link Callout */}
        {event.registration_link && (
          <div className="p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Official Registration Link</p>
              <p className="text-xs text-amber-800">
                Complete your registration directly on the organizer&apos;s portal or Google Form.
              </p>
            </div>
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#c93b2b] hover:bg-[#b02e20] text-amber-100 text-xs sm:text-sm font-bold rounded shadow flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Register Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-300">
          <div className="flex items-center gap-2">
            {/* Favourite Category */}
            <button
              onClick={() => handleAction('fav')}
              className={`p-2.5 rounded-full border transition-colors ${
                isFav
                  ? 'bg-amber-400 text-amber-950 border-amber-500'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:text-amber-500'
              }`}
              title="Subscribe to category"
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-950' : ''}`} />
            </button>

            {/* Save */}
            <button
              onClick={() => handleAction('save')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-[#c93b2b] text-white border-red-700'
                  : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Saved to Bookmarks' : 'Save for Later'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Campus Map Shortcut */}
            {isGoing && (
              <button
                onClick={() => {
                  closeEventDetail();
                  setCurrentTab('campus-map');
                }}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-[#c93b2b]" />
                <span>Locate on Map</span>
              </button>
            )}

            {/* I'm Going */}
            <button
              onClick={() => handleAction('going')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2 ${
                isGoing
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-neutral-900 hover:bg-black text-amber-100'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isGoing ? "You're Going!" : "I'm Going"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
