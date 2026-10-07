import { EventCategory, VenueZone, AcademicYear, EventItem, MapCoordinates, ClassScheduleItem } from '@/types';

export const EVENT_CATEGORIES: EventCategory[] = [
  'Academic',
  'Clubs',
  'Sports',
  'Social',
  'Competitions',
  'Workshops',
  'Performances',
  'Career',
  'Talks/Lectures',
  'Other',
];

export const ACADEMIC_YEARS: AcademicYear[] = ['UG1', 'UG2', 'UG3', 'UG4', 'All'];

export const VENUE_ZONES: VenueZone[] = [
  'Academics',
  'Sports',
  'Eateries',
  'Flora & Fauna',
  'Shantiniketan/Recreational',
];

export const VENUE_LOCATIONS_MAP: Record<VenueZone, string[]> = {
  Academics: [
    'Vikram Sarabhai Centre',
    'APJ Abdul Kalam',
    'Vivekananda Library',
    'Kalidas Centre',
    'Chanakya',
    'Aryabhatta',
  ],
  Sports: [
    'Arjuna Centre for Sports',
    'Cricket Ground',
    'Football Ground',
    'Track & Field',
    'Tennis Courts',
  ],
  Eateries: [
    'Aahar',
    'Rasoi',
    'Coffee Nation',
    'Hashtag',
    'Blue Tokai Cafe',
  ],
  'Flora & Fauna': [
    'Butterfly Garden',
    'Nakshatra Garden',
    'Botanical Garden',
  ],
  'Shantiniketan/Recreational': [
    'Auditorium',
    'FLAME Plaza',
    'FLAME Kund',
    'FLAME Lounge',
  ],
};

// Approximate zone positions on the 624x441 campus map image (percentage x, y)
export const ZONE_COORDINATES: Record<VenueZone, MapCoordinates> = {
  Academics: { x: 42, y: 38 },
  Sports: { x: 78, y: 28 },
  Eateries: { x: 34, y: 62 },
  'Flora & Fauna': { x: 18, y: 75 },
  'Shantiniketan/Recreational': { x: 58, y: 56 },
};

// Specific venue sub-coordinates on the illustrated campus map
export const SPECIFIC_VENUE_COORDINATES: Record<string, MapCoordinates> = {
  // Academics
  'Vikram Sarabhai Centre': { x: 40, y: 35 },
  'APJ Abdul Kalam': { x: 48, y: 32 },
  'Vivekananda Library': { x: 38, y: 44 },
  'Kalidas Centre': { x: 52, y: 40 },
  'Chanakya': { x: 45, y: 42 },
  'Aryabhatta': { x: 35, y: 33 },

  // Sports
  'Arjuna Centre for Sports': { x: 75, y: 24 },
  'Cricket Ground': { x: 84, y: 32 },
  'Football Ground': { x: 74, y: 36 },
  'Track & Field': { x: 80, y: 42 },
  'Tennis Courts': { x: 68, y: 22 },

  // Eateries
  'Aahar': { x: 32, y: 58 },
  'Rasoi': { x: 28, y: 64 },
  'Coffee Nation': { x: 37, y: 66 },
  'Hashtag': { x: 40, y: 58 },
  'Blue Tokai Cafe': { x: 30, y: 52 },

  // Flora & Fauna
  'Butterfly Garden': { x: 16, y: 72 },
  'Nakshatra Garden': { x: 24, y: 82 },
  'Botanical Garden': { x: 12, y: 65 },

  // Recreational
  'Auditorium': { x: 54, y: 48 },
  'FLAME Plaza': { x: 50, y: 58 },
  'FLAME Kund': { x: 60, y: 62 },
  'FLAME Lounge': { x: 65, y: 52 },
};

export const FREE_WILL_PROMPTS = [
  "Try a new iced caramel latte at Blue Tokai Cafe with a sketchbook.",
  "Go sit and watch the sunset unfold over the FLAME Kund steps.",
  "Pick up an unexpected poetry or philosophy book from Vivekananda Library.",
  "Take a peaceful, slow walk through the Butterfly Garden before dusk.",
  "Catch up with friends over hot cheese toast and chai at Hashtag.",
  "Stroll across the cricket pitch under the evening Pune breeze.",
  "Find a quiet corner at Kalidas Centre courtyard and journal your thoughts.",
  "Grab your guitar or earphones and hang out by the Nakshatra Garden path.",
];

export const DEFAULT_TIMETABLE_SAMPLE: ClassScheduleItem[] = [
  {
    id: 'class-1',
    courseName: 'Intro to Philosophy & Critical Thinking',
    day: 'Monday',
    timeStart: '09:00',
    timeEnd: '10:15',
    venueZone: 'Academics',
    room: 'Kalidas Centre 102',
  },
  {
    id: 'class-2',
    courseName: 'Data Visualization & Storytelling',
    day: 'Monday',
    timeStart: '10:30',
    timeEnd: '11:45',
    venueZone: 'Academics',
    room: 'Aryabhatta Lab 3',
  },
  {
    id: 'class-3',
    courseName: 'Contemporary South Asian Cinema',
    day: 'Wednesday',
    timeStart: '14:15',
    timeEnd: '15:30',
    venueZone: 'Academics',
    room: 'Vikram Sarabhai Centre 204',
  },
  {
    id: 'class-4',
    courseName: 'Macroeconomics for Global Markets',
    day: 'Wednesday',
    timeStart: '15:45',
    timeEnd: '17:00',
    venueZone: 'Academics',
    room: 'Chanakya Hall 1',
  },
  {
    id: 'class-5',
    courseName: 'Digital Media and Public Culture',
    day: 'Friday',
    timeStart: '11:00',
    timeEnd: '12:15',
    venueZone: 'Academics',
    room: 'APJ Abdul Kalam 105',
  },
];

// Helper to get formatted dates relative to today
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SEED_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    event_name: 'Sunset Acoustic Jam & Open Mic',
    category: 'Performances',
    date: getRelativeDate(0), // Today
    time_start_end: '18:00 - 20:00',
    time_start: '18:00',
    time_end: '20:00',
    venue_zone: 'Shantiniketan/Recreational',
    room_specific: 'FLAME Kund Amphitheatre',
    organizer: 'FLAME Music & Arts Guild',
    description: 'An unplugged evening under the stars. Bring your acoustic instruments, your spoken word poetry, or just a cup of hot chai to enjoy live indie student sets.',
    registration_deadline: `${getRelativeDate(0)} 16:00`,
    registration_link: 'https://forms.google.com/flame-acoustic-jam',
    requirements_eligibility: 'Open to All Cohorts',
    status: 'Upcoming',
    event_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'student.council@flame.edu.in',
  },
  {
    id: 'evt-2',
    event_name: 'HackFLAME 2026: 24h AI Hackathon',
    category: 'Competitions',
    date: getRelativeDate(1), // Tomorrow
    time_start_end: '10:00 - 18:00',
    time_start: '10:00',
    time_end: '18:00',
    venue_zone: 'Academics',
    room_specific: 'APJ Abdul Kalam Innovation Hub',
    organizer: 'Computing & Tech Society',
    description: 'The premier inter-disciplinary tech hackathon of the year. Build generative AI agents, smart campus utilities, or creative media tech. ₹50,000 in cash prizes + internship interviews.',
    registration_deadline: `${getRelativeDate(0)} 23:59`, // Urgent deadline!
    registration_link: 'https://forms.google.com/hackflame-2026-reg',
    requirements_eligibility: 'Teams of 2-4 (UG1 - UG4)',
    status: 'Upcoming',
    event_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'tech.club@flame.edu.in',
  },
  {
    id: 'evt-3',
    event_name: 'Late Night Coffee & Philosophy Salon',
    category: 'Clubs',
    date: getRelativeDate(0), // Today
    time_start_end: '21:00 - 22:30',
    time_start: '21:00',
    time_end: '22:30',
    venue_zone: 'Eateries',
    room_specific: 'Blue Tokai Cafe Mezzanine',
    organizer: 'Dialectic Philosophy Society',
    description: 'Topic of the night: "AI Consciousness and Digital Nostalgia: Do robots feel FOMO?" Complimentary freshly brewed pour-over coffee for all registered attendees.',
    registration_deadline: `${getRelativeDate(0)} 19:00`,
    registration_link: 'https://forms.google.com/flame-philosophy-salon',
    requirements_eligibility: 'All UG cohorts welcome',
    status: 'Upcoming',
    event_image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'philosophy.soc@flame.edu.in',
  },
  {
    id: 'evt-4',
    event_name: 'FLAME Premier League: Football Finals',
    category: 'Sports',
    date: getRelativeDate(2),
    time_start_end: '16:30 - 18:30',
    time_start: '16:30',
    time_end: '18:30',
    venue_zone: 'Sports',
    room_specific: 'Football Ground (Main Pitch)',
    organizer: 'FLAME Sports Committee',
    description: 'The championship match: Titans FC vs Falcon United. Halftime dance performance by the Dance Club and food stalls by Aahar.',
    registration_deadline: `${getRelativeDate(1)} 18:00`,
    registration_link: 'https://forms.google.com/fpl-finals-cheer',
    requirements_eligibility: 'Open to the entire FLAME community',
    status: 'Upcoming',
    event_image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'sports.sec@flame.edu.in',
  },
  {
    id: 'evt-5',
    event_name: 'Guest Masterclass: Documentary Filmmaking',
    category: 'Talks/Lectures',
    date: getRelativeDate(3),
    time_start_end: '15:00 - 17:00',
    time_start: '15:00',
    time_end: '17:00',
    venue_zone: 'Shantiniketan/Recreational',
    room_specific: 'Auditorium Main Stage',
    organizer: 'Department of Media Studies',
    description: 'National Award-winning filmmaker Anand Gandhi shares techniques on capturing micro-narratives and authentic human empathy in long-form cinema.',
    registration_deadline: `${getRelativeDate(2)} 12:00`,
    registration_link: 'https://forms.google.com/doc-filmmaking-masterclass',
    requirements_eligibility: 'Priority seating for Media & Humanities majors',
    status: 'Upcoming',
    event_image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'media.dept@flame.edu.in',
  },
  {
    id: 'evt-6',
    event_name: 'Morning Mindfulness & Bird Watching Walk',
    category: 'Social',
    date: getRelativeDate(1),
    time_start_end: '07:00 - 08:30',
    time_start: '07:00',
    time_end: '08:30',
    venue_zone: 'Flora & Fauna',
    room_specific: 'Butterfly Garden & Eco-Trail',
    organizer: 'FLAME Nature Conservation Club',
    description: 'Spot purple sunbirds, Indian paradise flycatchers, and indigenous biodiversity on our tranquil campus. Binoculars provided for the first 20 registrations.',
    registration_deadline: `${getRelativeDate(0)} 20:00`,
    registration_link: 'https://forms.google.com/nature-trail-walk',
    requirements_eligibility: 'Open to All',
    status: 'Upcoming',
    event_image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'nature.club@flame.edu.in',
  },
  {
    id: 'evt-7',
    event_name: 'Venture Capital Pitch & Career Fair',
    category: 'Career',
    date: getRelativeDate(4),
    time_start_end: '11:00 - 16:00',
    time_start: '11:00',
    time_end: '16:00',
    venue_zone: 'Academics',
    room_specific: 'Vikram Sarabhai Centre Gallery',
    organizer: 'FLAME Centre for Entrepreneurship',
    description: 'Meet 15+ top venture funds and startup founders hiring for summer internships and full-time analyst roles.',
    registration_deadline: `${getRelativeDate(3)} 23:59`,
    registration_link: 'https://forms.google.com/vc-pitch-career-2026',
    requirements_eligibility: 'UG3 & UG4 students',
    status: 'Upcoming',
    event_image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'career.services@flame.edu.in',
  },
  {
    id: 'evt-8',
    event_name: 'Inter-House Clay Pottery Workshop',
    category: 'Workshops',
    date: getRelativeDate(-1), // Yesterday - Closed State Example!
    time_start_end: '14:00 - 16:30',
    time_start: '14:00',
    time_end: '16:30',
    venue_zone: 'Shantiniketan/Recreational',
    room_specific: 'FLAME Plaza Arts Kiosk',
    organizer: 'Visual Arts Collective',
    description: 'Learn the tactile craft of wheel pottery and terra-cotta sculpting. Handcraft your own souvenir mug or vase.',
    registration_deadline: `${getRelativeDate(-2)} 18:00`,
    registration_link: 'https://forms.google.com/pottery-workshop-past',
    requirements_eligibility: 'Open to All',
    status: 'Registration Closed',
    event_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'arts.council@flame.edu.in',
  },
  {
    id: 'evt-9',
    event_name: 'Night Sky Stargazing Session',
    category: 'Academic',
    date: getRelativeDate(2),
    time_start_end: '22:00 - 00:00',
    time_start: '22:00',
    time_end: '00:00',
    venue_zone: 'Sports',
    room_specific: 'Cricket Ground Pavillion Roof',
    organizer: 'Astronomy & Physics Club',
    description: 'High-powered Celestron telescopes will be set up to view Saturn rings, Jupiter moons, and the Orion Nebula. Hot cocoa will be served.',
    registration_deadline: `${getRelativeDate(1)} 22:00`,
    registration_link: 'https://forms.google.com/stargazing-session',
    requirements_eligibility: 'All students & faculty',
    status: 'Cancelled', // Cancelled State Example!
    event_image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    submitted_by: 'astro.club@flame.edu.in',
  },
];
