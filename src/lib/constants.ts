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

// Clean slate for production: all events come dynamically from Supabase database
export const INITIAL_SEED_EVENTS: EventItem[] = [];
