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
    'Vikram Sarabhai Centre - Room 101',
    'Vikram Sarabhai Centre - Room 102',
    'Vikram Sarabhai Centre - Room 201',
    'Vikram Sarabhai Centre - Room 204',
    'Vikram Sarabhai Centre - Lecture Hall A',
    'Vikram Sarabhai Centre - Lecture Hall B',
    'Vikram Sarabhai Centre - Conference Hall',
    'APJ Abdul Kalam - Innovation Hub / Lab',
    'APJ Abdul Kalam - Design Studio',
    'APJ Abdul Kalam - Room 105',
    'APJ Abdul Kalam - Room 202',
    'Kalidas Centre - Seminar Hall',
    'Kalidas Centre - Visual Arts Studio',
    'Kalidas Centre - Room 102',
    'Kalidas Centre - Room 205',
    'Chanakya - Hall 1',
    'Chanakya - Hall 2',
    'Chanakya - Room 201',
    'Chanakya - Room 202',
    'Aryabhatta - Computer Lab 1',
    'Aryabhatta - Computer Lab 2',
    'Aryabhatta - AI & Data Lab 3',
    'Aryabhatta - Classroom 101',
    'Vivekananda Library - Main Reading Hall',
    'Vivekananda Library - Discussion Room 1',
    'Vivekananda Library - Discussion Room 2',
    'Vivekananda Library - Digital Media Archive',
  ],
  Sports: [
    'Arjuna Centre for Sports - Indoor Badminton Arena',
    'Arjuna Centre for Sports - Gymnasium & Fitness Suite',
    'Arjuna Centre for Sports - Squash Courts',
    'Arjuna Centre for Sports - Table Tennis Room',
    'Cricket Ground - Main Pitch',
    'Cricket Ground - Pavilion',
    'Football Ground - Main Pitch',
    'Football Ground - Practice Turf',
    'Track & Field - 400m Running Track',
    'Tennis Courts - Court 1',
    'Tennis Courts - Court 2',
    'Basketball Courts - Floodlit Main Court',
    'Volleyball Court',
    'Swimming Pool Complex',
  ],
  Eateries: [
    'Aahar - Main Dining Hall',
    'Aahar - First Floor Mezzanine',
    'Rasoi - Food Court Counter',
    'Coffee Nation - Outdoor Patio',
    'Coffee Nation - Indoor Lounge',
    'Hashtag Cafe - Main Seating',
    'Blue Tokai Cafe - Mezzanine Lounge',
    'Blue Tokai Cafe - Ground Veranda',
    'Juice & Snacks Kiosk (Sports Complex)',
  ],
  'Flora & Fauna': [
    'Butterfly Garden - Central Walkway',
    'Butterfly Garden - Gazebo Lawn',
    'Nakshatra Garden - Eco Trail Path',
    'Botanical Garden - Bamboo Grove',
    'FLAME Lake - Sunset Viewing Deck',
  ],
  'Shantiniketan/Recreational': [
    'Auditorium - Main Stage & Hall',
    'Auditorium - Foyer Gallery',
    'FLAME Kund - Amphitheatre Steps',
    'FLAME Kund - Central Stage',
    'FLAME Plaza - Central Courtyard',
    'FLAME Plaza - Arts & Exhibition Kiosk',
    'FLAME Lounge - Student Common Room',
    'Music Society Jam Room',
    'Dance Club Rehearsal Studio',
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
