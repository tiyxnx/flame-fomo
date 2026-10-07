'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  EventCategory, 
  VenueZone, 
  EventStatus, 
  EventItem 
} from '@/types';
import { 
  EVENT_CATEGORIES, 
  VENUE_ZONES, 
  VENUE_LOCATIONS_MAP 
} from '@/lib/constants';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Link as LinkIcon, 
  Users, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CreateEventModal: React.FC = () => {
  const { isCreateEventOpen, closeCreateEvent, createEvent, user } = useApp();

  // Form State matching read.md Section 8 exactly
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState<EventCategory>('Clubs');
  const [date, setDate] = useState('2026-10-08');

  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);
  const [timeStart, setTimeStart] = useState('17:00');
  const [timeEnd, setTimeEnd] = useState('18:30');
  const [venueZone, setVenueZone] = useState<VenueZone>('Academics');
  const [roomSpecific, setRoomSpecific] = useState('');
  const [organizer, setOrganizer] = useState(user?.name ? `${user.name} / Student Org` : 'FLAME Student Initiative');
  const [description, setDescription] = useState('');
  const [registrationDeadlineDate, setRegistrationDeadlineDate] = useState('');
  const [registrationDeadlineTime, setRegistrationDeadlineTime] = useState('23:59');
  const [registrationLink, setRegistrationLink] = useState('');
  const [requirementsEligibility, setRequirementsEligibility] = useState('Open to All Students');
  const [eventImage, setEventImage] = useState('');
  const [status, setStatus] = useState<EventStatus>('Upcoming');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isCreateEventOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!eventName.trim()) {
      setErrorMsg('Event Name is required.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Event Description is required.');
      return;
    }
    if (!organizer.trim()) {
      setErrorMsg('Organizer name is required.');
      return;
    }

    const timeStartEnd = `${timeStart} - ${timeEnd}`;
    const deadlineString = registrationDeadlineDate 
      ? `${registrationDeadlineDate} ${registrationDeadlineTime}`.trim()
      : undefined;

    createEvent({
      event_name: eventName.trim(),
      category,
      date,
      time_start_end: timeStartEnd,
      time_start: timeStart,
      time_end: timeEnd,
      venue_zone: venueZone,
      room_specific: roomSpecific.trim() || undefined,
      organizer: organizer.trim(),
      description: description.trim(),
      registration_deadline: deadlineString,
      registration_link: registrationLink.trim() || undefined,
      requirements_eligibility: requirementsEligibility.trim() || undefined,
      event_image: eventImage.trim() || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80',
      status,
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    closeCreateEvent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#fcfbf7] text-neutral-900 rounded-sm shadow-2xl border-4 border-[#e8dfc9] p-6 sm:p-8"
        style={{
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Washi tape header motif */}
        <div 
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#f3da90]/90 shadow-md backdrop-blur-xs rotate-[-1deg] pointer-events-none"
          style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
        />

        {/* Close Button */}
        <button
          onClick={closeCreateEvent}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="stamp-urgent text-[10px]">Student Bulletin</span>
            <span className="text-xs text-neutral-500 font-handwritten text-base">post to campus</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Submit a Campus Event
          </h2>
          <p className="text-xs text-neutral-600 font-sans-ui mt-0.5">
            Published events instantly appear on the discovery collage, planner, and interactive campus map.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-xs text-xs text-red-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* 1. Event Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Event Title <span className="text-[#c93b2b]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Midnight Acoustic Jam or AI Prompt Battle"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#d6cbb0] rounded-sm text-sm text-neutral-900 focus:outline-none focus:border-[#c93b2b] focus:ring-1 focus:ring-[#c93b2b]"
              required
            />
          </div>

          {/* 2. Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Category <span className="text-[#c93b2b]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#d6cbb0] rounded-sm text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#c93b2b]"
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Initial Status <span className="text-[#c93b2b]">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#d6cbb0] rounded-sm text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#c93b2b]"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Registration Closed">Registration Closed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* 3. Date & Time Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Date <span className="text-[#c93b2b]">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Start Time <span className="text-[#c93b2b]">*</span>
              </label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                End Time <span className="text-[#c93b2b]">*</span>
              </label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
                required
              />
            </div>
          </div>

          {/* 4. Strictly Mapped Locations: Venue Zone & Specific Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f5eee0] border border-[#e2d5bd] rounded-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                Campus Venue Zone <span className="text-[#c93b2b]">*</span>
              </label>
              <select
                value={venueZone}
                onChange={(e) => {
                  const newZone = e.target.value as VenueZone;
                  setVenueZone(newZone);
                  // Suggest default first location in zone
                  setRoomSpecific(VENUE_LOCATIONS_MAP[newZone][0]);
                }}
                className="w-full px-3 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs font-semibold text-neutral-900"
              >
                {VENUE_ZONES.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
              <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                Pulls strictly from FLAME layout zones
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                Specific Location / Room
              </label>
              <input
                type="text"
                list="zone-locations-list"
                placeholder="e.g. Vikram Sarabhai Centre 204 or FLAME Kund"
                value={roomSpecific}
                onChange={(e) => setRoomSpecific(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
              />
              <datalist id="zone-locations-list">
                {VENUE_LOCATIONS_MAP[venueZone]?.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
              <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                Suggestions: {VENUE_LOCATIONS_MAP[venueZone]?.slice(0, 3).join(', ')}...
              </p>
            </div>
          </div>

          {/* 5. Organizer & Eligibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Organizer / Student Club <span className="text-[#c93b2b]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Student Council or Media Collective"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Cohort / Eligibility
              </label>
              <input
                type="text"
                placeholder="e.g. Open to All or UG2 & UG3 only"
                value={requirementsEligibility}
                onChange={(e) => setRequirementsEligibility(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
              />
            </div>
          </div>

          {/* 6. Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Description <span className="text-[#c93b2b]">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="What makes this event exciting? Add instructions, vibe, gear to bring, or what to expect."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs sm:text-sm text-neutral-900 font-sans-ui"
              required
            />
          </div>

          {/* 7. Registration Deadline & External Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 border border-amber-200/80 rounded-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                Registration Deadline (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={registrationDeadlineDate}
                  onChange={(e) => setRegistrationDeadlineDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
                />
                <input
                  type="time"
                  value={registrationDeadlineTime}
                  onChange={(e) => setRegistrationDeadlineTime(e.target.value)}
                  className="w-28 px-2 py-1.5 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
                />
              </div>
              <p className="text-[10px] text-amber-800 mt-1">
                Triggers high-priority red stamp and notification radar
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                External Registration Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://forms.google.com/your-form"
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
              />
              <p className="text-[10px] text-amber-800 mt-1">
                Direct link to Google Form / RSVP website
              </p>
            </div>
          </div>

          {/* 8. Event Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Event Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... (Leave blank for default theme)"
              value={eventImage}
              onChange={(e) => setEventImage(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#d6cbb0] rounded-sm text-xs text-neutral-900"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#e2d5bd] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeCreateEvent}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#c93b2b] hover:bg-[#b02e20] text-amber-100 text-xs sm:text-sm font-bold rounded-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Publish Event to Bulletin</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
