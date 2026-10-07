'use client';

import React from 'react';
import { EventItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Bookmark, 
  Check, 
  AlertCircle,
  ExternalLink,
  Users
} from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  rotationIndex?: number; // 0, 1, 2, 3 to produce subtle 1-3 deg organic collage tilt
}

export const EventCard: React.FC<EventCardProps> = ({ event, rotationIndex = 0 }) => {
  const {
    user,
    isAuthenticated,
    savedEventIds,
    goingEventIds,
    favouriteCategories,
    toggleSaveEvent,
    toggleGoingEvent,
    toggleFavouriteCategory,
    openAuthModal,
    openEventDetail,
  } = useApp();

  const isSaved = savedEventIds.includes(event.id);
  const isGoing = goingEventIds.includes(event.id);
  const isFavCategory = favouriteCategories.includes(event.category);
  const isCancelled = event.status === 'Cancelled';

  // Check if past deadline for Closed state
  const [isPastDeadline, setIsPastDeadline] = React.useState(false);

  React.useEffect(() => {
    if (event.registration_deadline) {
      const deadlineDate = new Date(event.registration_deadline);
      if (!isNaN(deadlineDate.getTime()) && deadlineDate < new Date()) {
        setIsPastDeadline(true);
      }
    }
  }, [event.registration_deadline]);

  const isRegistrationClosed = event.status === 'Registration Closed' || isPastDeadline;

  // Apply grayscale if registration closed and user is not attending
  const applyGrayscaleFilter = isRegistrationClosed && !isGoing;

  // Determine tilt style
  const tiltClasses = ['tilt-1', 'tilt-n1', 'tilt-2', 'tilt-n2', 'tilt-1'];
  const tiltClass = tiltClasses[rotationIndex % tiltClasses.length];

  // Tape color motif rotation
  const tapeStyles = [
    'bg-[#f3da90]/80', // kraft gold
    'bg-[#f5afa8]/80', // soft rose
    'bg-[#a2d9ce]/80', // seafoam green
    'bg-[#e2cbb0]/80', // parchment
  ];
  const tapeBg = tapeStyles[rotationIndex % tapeStyles.length];

  // Category tone styling
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Performances':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Competitions':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Sports':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Academic':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Clubs':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Social':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Workshops':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Career':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Talks/Lectures':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const handleActionClick = (e: React.MouseEvent, actionType: 'favourite' | 'going' | 'save') => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openAuthModal('Sign in with your FLAME email to save this event and build your plan.');
      return;
    }

    if (actionType === 'favourite') {
      toggleFavouriteCategory(event.category);
    } else if (actionType === 'going') {
      toggleGoingEvent(event.id);
    } else if (actionType === 'save') {
      toggleSaveEvent(event.id);
    }
  };

  return (
    <div
      onClick={() => openEventDetail(event)}
      className={`group relative polaroid-card ${tiltClass} p-3.5 sm:p-4 text-neutral-900 cursor-pointer select-none transition-all duration-300 ${
        applyGrayscaleFilter ? 'filter grayscale contrast-90 opacity-80' : ''
      }`}
    >
      {/* Scrapbook Tape / Pinned Edge Motif */}
      <div 
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 ${tapeBg} shadow-sm backdrop-blur-xs rotate-[-1deg] clip-path-tape z-10 pointer-events-none`}
        style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
      />
      <div className="push-pin" />

      {/* Cancelled Stamp Overlay */}
      {isCancelled && (
        <div className="stamp-cancelled">
          CANCELLED
        </div>
      )}

      {/* Polaroid Image Anchor or Paper Graphic Box */}
      <div className="relative w-full aspect-16/10 rounded-sm overflow-hidden bg-[#ebe4d1] border border-neutral-300 shadow-inner mb-3">
        {event.event_image ? (
          <img
            src={event.event_image}
            alt={event.event_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f5eb] to-[#e4dcc7] p-4 text-center">
            <Calendar className="w-8 h-8 text-[#9b8d74] mb-1" />
            <span className="font-editorial text-xs italic text-[#7a6e57]">FLAME Campus Event</span>
          </div>
        )}

        {/* Category Badge pinned to top-left of photo */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border shadow-sm ${getCategoryBadgeColor(event.category)}`}>
            {event.category}
          </span>
        </div>

        {/* Registration Deadline Banner / Stamp */}
        {event.registration_deadline && !isCancelled && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="stamp-urgent">
              <span>Deadline:</span>
              <span>{event.registration_deadline.split(' ')[0]}</span>
            </span>
          </div>
        )}

        {/* Hover/Tap Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2 z-20 backdrop-blur-xs">
          {/* Favourite (Star Icon) */}
          <button
            onClick={(e) => handleActionClick(e, 'favourite')}
            title={isFavCategory ? 'Unsubscribe from category' : 'Favourite Category'}
            className={`p-2.5 rounded-full transition-transform active:scale-90 shadow-md ${
              isFavCategory
                ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                : 'bg-white/90 text-neutral-800 hover:bg-white hover:text-amber-500'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavCategory ? 'fill-amber-950' : ''}`} />
          </button>

          {/* I'm Going (Pill) */}
          <button
            onClick={(e) => handleActionClick(e, 'going')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-90 shadow-md flex items-center gap-1.5 ${
              isGoing
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                : 'bg-white/90 text-neutral-900 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isGoing ? "I'm Going!" : "I'm Going"}</span>
          </button>

          {/* Save (Pill) */}
          <button
            onClick={(e) => handleActionClick(e, 'save')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-90 shadow-md flex items-center gap-1.5 ${
              isSaved
                ? 'bg-[#c93b2b] text-white ring-2 ring-red-300'
                : 'bg-white/90 text-neutral-900 hover:bg-[#c93b2b] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Polaroid Text & Functional UI Metadata */}
      <div className="flex flex-col space-y-1.5">
        
        {/* Title in Editorial Serif */}
        <h3 className="font-editorial text-base sm:text-lg font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#c93b2b] transition-colors">
          {event.event_name}
        </h3>

        {/* Date & Time line */}
        <div className="flex items-center gap-3 text-xs text-neutral-700 font-sans-ui pt-0.5">
          <div className="flex items-center gap-1 text-neutral-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#c93b2b]" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-1 text-neutral-700">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>{event.time_start_end}</span>
          </div>
        </div>

        {/* Venue Zone & Specific Room */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-sans-ui truncate">
          <MapPin className="w-3.5 h-3.5 text-[#c93b2b] shrink-0" />
          <span className="font-semibold text-neutral-800">{event.venue_zone}</span>
          {event.room_specific && (
            <>
              <span className="text-neutral-400">·</span>
              <span className="truncate text-neutral-600">{event.room_specific}</span>
            </>
          )}
        </div>

        {/* Organizer annotation in handwritten font */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-200/80">
          <span className="font-handwritten text-xs text-neutral-500 truncate">
            by {event.organizer}
          </span>

          {/* Status indicators */}
          {isGoing && (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Added to Plan
            </span>
          )}
          {isSaved && !isGoing && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Bookmark className="w-2.5 h-2.5 fill-amber-800" /> Bookmarked
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
