-- ==============================================================================
-- FLAME FOMO: SUPABASE DATABASE SETUP SCRIPT
-- ==============================================================================
-- This script sets up the two main tables for FLAME FOMO:
-- 1. "profiles" - Stores student profile data, cohort, interests, timetable & saved events
-- 2. "events"   - Stores campus events, locations, deadlines, and registration links
-- ==============================================================================

-- 1. Create the PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  flame_email TEXT PRIMARY KEY,                       -- Strictly @flame.edu.in
  name TEXT NOT NULL,                                 -- Student display name
  academic_year TEXT NOT NULL DEFAULT 'UG2',          -- UG1, UG2, UG3, UG4, All
  category_preferences JSONB DEFAULT '[]'::jsonb,    -- Array of preferred category strings
  academic_timetable JSONB DEFAULT '[]'::jsonb,      -- Array of enrolled class objects for clash detection
  saved_events JSONB DEFAULT '[]'::jsonb,             -- Event IDs marked as Saved
  going_events JSONB DEFAULT '[]'::jsonb,             -- Event IDs marked as I'm Going
  favourite_categories JSONB DEFAULT '[]'::jsonb,     -- Starred categories
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the EVENTS table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,                                -- Unique Event ID (e.g. evt-1)
  event_name TEXT NOT NULL,                           -- Prominent card title
  category TEXT NOT NULL,                             -- Academic, Clubs, Sports, Performances, etc.
  date DATE NOT NULL,                                 -- YYYY-MM-DD
  time_start_end TEXT NOT NULL,                       -- e.g. "18:00 - 20:00"
  time_start TEXT,                                    -- e.g. "18:00"
  time_end TEXT,                                      -- e.g. "20:00"
  venue_zone TEXT NOT NULL,                           -- Academics, Sports, Eateries, Flora & Fauna, Shantiniketan/Recreational
  room_specific TEXT,                                 -- e.g. "Vikram Sarabhai Centre 204" or "FLAME Kund"
  organizer TEXT NOT NULL,                            -- e.g. "FLAME Music & Arts Guild"
  description TEXT NOT NULL,                          -- Readable full paragraph
  registration_deadline TEXT,                         -- Deadline date & time
  registration_link TEXT,                             -- Google Form or external portal URL
  requirements_eligibility TEXT,                      -- e.g. "Open to All Cohorts"
  event_image TEXT,                                   -- Photo URL inside Polaroid frame
  status TEXT NOT NULL DEFAULT 'Upcoming',            -- Upcoming, Registration Closed, Cancelled
  submitted_by TEXT,                                  -- Student email who published the event
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) & Allow Public Read/Write for Student Community
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anyone with the anon key to read profiles & events
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public write profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Public delete events" ON public.events FOR DELETE USING (true);

-- 4. Insert Initial Seed Events (FLAME Campus Events)
INSERT INTO public.events (
  id, event_name, category, date, time_start_end, time_start, time_end,
  venue_zone, room_specific, organizer, description, registration_deadline,
  registration_link, requirements_eligibility, event_image, status, submitted_by
) VALUES
(
  'evt-1',
  'Sunset Acoustic Jam & Open Mic',
  'Performances',
  CURRENT_DATE,
  '18:00 - 20:00',
  '18:00',
  '20:00',
  'Shantiniketan/Recreational',
  'FLAME Kund Amphitheatre',
  'FLAME Music & Arts Guild',
  'An unplugged evening under the stars. Bring your acoustic instruments, your spoken word poetry, or just a cup of hot chai to enjoy live indie student sets.',
  TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') || ' 16:00',
  'https://forms.google.com/flame-acoustic-jam',
  'Open to All Cohorts',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'Upcoming',
  'student.council@flame.edu.in'
),
(
  'evt-2',
  'HackFLAME 2026: 24h AI Hackathon',
  'Competitions',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00 - 18:00',
  '10:00',
  '18:00',
  'Academics',
  'APJ Abdul Kalam Innovation Hub',
  'Computing & Tech Society',
  'The premier inter-disciplinary tech hackathon of the year. Build generative AI agents, smart campus utilities, or creative media tech. ₹50,000 in cash prizes + internship interviews.',
  TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') || ' 23:59',
  'https://forms.google.com/hackflame-2026-reg',
  'Teams of 2-4 (UG1 - UG4)',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  'Upcoming',
  'tech.club@flame.edu.in'
),
(
  'evt-3',
  'Late Night Coffee & Philosophy Salon',
  'Clubs',
  CURRENT_DATE,
  '21:00 - 22:30',
  '21:00',
  '22:30',
  'Eateries',
  'Blue Tokai Cafe Mezzanine',
  'Dialectic Philosophy Society',
  'Topic of the night: "AI Consciousness and Digital Nostalgia: Do robots feel FOMO?" Complimentary freshly brewed pour-over coffee for all registered attendees.',
  TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') || ' 19:00',
  'https://forms.google.com/flame-philosophy-salon',
  'All UG cohorts welcome',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
  'Upcoming',
  'philosophy.soc@flame.edu.in'
),
(
  'evt-4',
  'FLAME Premier League: Football Finals',
  'Sports',
  CURRENT_DATE + INTERVAL '2 days',
  '16:30 - 18:30',
  '16:30',
  '18:30',
  'Sports',
  'Football Ground (Main Pitch)',
  'FLAME Sports Committee',
  'The championship match: Titans FC vs Falcon United. Halftime dance performance by the Dance Club and food stalls by Aahar.',
  TO_CHAR(CURRENT_DATE + INTERVAL '1 day', 'YYYY-MM-DD') || ' 18:00',
  'https://forms.google.com/fpl-finals-cheer',
  'Open to the entire FLAME community',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80',
  'Upcoming',
  'sports.sec@flame.edu.in'
)
ON CONFLICT (id) DO NOTHING;
