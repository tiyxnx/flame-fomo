'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  EventItem, 
  EventCategory, 
  NotificationItem, 
  ClassScheduleItem 
} from '@/types';
import { 
  INITIAL_SEED_EVENTS, 
  DEFAULT_TIMETABLE_SAMPLE 
} from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ClashInfo {
  event: EventItem;
  conflictTitle: string;
  conflictTime: string;
}

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  events: EventItem[];
  savedEventIds: string[];
  goingEventIds: string[];
  favouriteCategories: EventCategory[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;

  // Active view tab
  currentTab: 'home' | 'explore' | 'my-plan' | 'campus-map' | 'profile';
  setCurrentTab: (tab: 'home' | 'explore' | 'my-plan' | 'campus-map' | 'profile') => void;

  // Modals
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;

  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;

  isCreateEventOpen: boolean;
  openCreateEvent: () => void;
  closeCreateEvent: () => void;

  selectedEventForDetail: EventItem | null;
  openEventDetail: (event: EventItem) => void;
  closeEventDetail: () => void;

  clashInfo: ClashInfo | null;
  resolveClash: (proceed: boolean) => void;

  externalRegEvent: EventItem | null;
  closeExternalRegModal: () => void;

  // User Actions
  loginAsGuest: () => void;
  loginWithFlameEmail: (email: string, name?: string) => { success: boolean; error?: string };
  sendVerificationCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtpCode: (email: string, code: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Event Actions
  toggleSaveEvent: (eventId: string) => void;
  toggleGoingEvent: (eventId: string, force?: boolean) => void;
  toggleFavouriteCategory: (category: EventCategory) => void;
  createEvent: (eventData: Omit<EventItem, 'id' | 'created_at'>) => void;
  updateEvent: (eventId: string, eventData: Partial<EventItem>) => void;
  deleteEvent: (eventId: string) => void;
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'flame_fomo_user_profile';
const LOCAL_STORAGE_EVENTS_KEY = 'flame_fomo_events';
const LOCAL_STORAGE_NOTIFS_KEY = 'flame_fomo_notifications';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_SEED_EVENTS);
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'my-plan' | 'campus-map' | 'profile'>('home');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string>('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [clashInfo, setClashInfo] = useState<ClashInfo | null>(null);
  const [externalRegEvent, setExternalRegEvent] = useState<EventItem | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load state on client mount
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_SEED_EVENTS));
      }

      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Generate notifications based on urgent deadlines
      const notifs: NotificationItem[] = [
        {
          id: 'notif-1',
          title: 'Registration Closing Soon!',
          message: 'HackFLAME 2026: 24h AI Hackathon registration closes tonight at 23:59!',
          eventId: 'evt-2',
          deadline: 'Tonight, 23:59',
          type: 'urgent_deadline',
          read: false,
          timestamp: 'Just now',
        },
        {
          id: 'notif-2',
          title: 'Event Today',
          message: 'Sunset Acoustic Jam begins today at 18:00 at FLAME Kund.',
          eventId: 'evt-1',
          deadline: 'Today, 18:00',
          type: 'new_event',
          read: false,
          timestamp: '2 hours ago',
        },
      ];
      setNotifications(notifs);
      // Sync with Supabase cloud if keys are present
      if (isSupabaseConfigured()) {
        supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .then(({ data, error }) => {
            if (data && data.length > 0) {
              setEvents(data as EventItem[]);
              localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(data));
            }
          });

        // Auto-detect when student clicks the confirmation link in their email
        const handleSession = async (session: any) => {
          if (session?.user?.email) {
            const confirmedEmail = session.user.email.toLowerCase();
            try {
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('flame_email', confirmedEmail)
                .single();

              if (existingProfile) {
                setUser(existingProfile as UserProfile);
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(existingProfile));
                setIsAuthModalOpen(false);
              } else {
                const defaultName = confirmedEmail.split('@')[0].replace('.', ' ').toUpperCase();
                const newProfile: UserProfile = {
                  flame_email: confirmedEmail,
                  name: defaultName,
                  academic_year: 'UG2',
                  category_preferences: ['Performances', 'Clubs', 'Competitions', 'Social'],
                  academic_timetable: DEFAULT_TIMETABLE_SAMPLE,
                  saved_events: ['evt-3'],
                  going_events: ['evt-1'],
                  favourite_categories: ['Performances', 'Competitions'],
                  created_at: new Date().toISOString(),
                };
                setUser(newProfile);
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
                await supabase.from('profiles').upsert([newProfile]);
                setIsAuthModalOpen(false);
                setIsOnboardingOpen(true);
              }
            } catch (err) {
              console.error('Error syncing confirmed student session:', err);
            }
          }
        };

        // Check active session immediately
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) handleSession(session);
        });

        // Listen for redirect hash token when student clicks email link
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) handleSession(session);
        });

        return () => {
          authListener?.subscription?.unsubscribe();
        };
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Save events to local storage on change
  const saveEventsToStorage = (updated: EventItem[]) => {
    setEvents(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist events:', e);
    }
  };

  // Save user profile to local storage on change
  const saveUserToStorage = (updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    try {
      if (updatedUser) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to persist user profile:', e);
    }
  };

  const openAuthModal = (reason = 'Sign in with your FLAME email to save this event and build your plan.') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  };

  const openOnboarding = () => setIsOnboardingOpen(true);
  const closeOnboarding = () => setIsOnboardingOpen(false);

  const openCreateEvent = () => {
    if (!user) {
      openAuthModal('Sign in with your FLAME email to post events.');
      return;
    }
    setIsCreateEventOpen(true);
  };

  const closeCreateEvent = () => setIsCreateEventOpen(false);

  const openEventDetail = (event: EventItem) => setSelectedEventForDetail(event);
  const closeEventDetail = () => setSelectedEventForDetail(null);

  const closeExternalRegModal = () => setExternalRegEvent(null);

  const loginAsGuest = () => {
    saveUserToStorage(null);
    closeAuthModal();
  };

  const loginWithFlameEmail = (email: string, name = 'FLAME Scholar') => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.endsWith('@flame.edu.in')) {
      return {
        success: false,
        error: 'Only official @flame.edu.in email addresses are permitted.',
      };
    }

    const newUser: UserProfile = {
      flame_email: trimmed,
      name: name || trimmed.split('@')[0].replace('.', ' ').toUpperCase(),
      academic_year: 'UG2',
      category_preferences: ['Performances', 'Clubs', 'Competitions', 'Social'],
      academic_timetable: DEFAULT_TIMETABLE_SAMPLE,
      saved_events: ['evt-3'],
      going_events: ['evt-1'],
      favourite_categories: ['Performances', 'Competitions'],
      created_at: new Date().toISOString(),
    };

    saveUserToStorage(newUser);
    closeAuthModal();
    // Prompt onboarding for first time
    openOnboarding();
    return { success: true };
  };

  const sendVerificationCode = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.endsWith('@flame.edu.in')) {
      return {
        success: false,
        error: 'Only official @flame.edu.in email addresses are permitted.',
      };
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: trimmed,
          options: {
            shouldCreateUser: true,
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send verification code.' };
      }
    }

    return { success: true };
  };

  const verifyOtpCode = async (
    email: string, 
    code: string, 
    name = 'FLAME Scholar'
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const token = code.trim();

    if (!token) {
      return { success: false, error: 'Please enter the 6-digit code sent to your email.' };
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: trimmed,
          token: token,
          type: 'email',
        });

        if (error) {
          return { success: false, error: error.message || 'Invalid or expired code. Please check your email or click the link.' };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Verification failed. Please try again.' };
      }
    }

    // Check if profile exists in Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('flame_email', trimmed)
          .single();

        if (existingProfile) {
          saveUserToStorage(existingProfile as UserProfile);
          closeAuthModal();
          return { success: true };
        }
      } catch (e) {
        // No existing profile, proceed to create
      }
    }

    // Create new profile for first-time student
    const newUser: UserProfile = {
      flame_email: trimmed,
      name: name || trimmed.split('@')[0].replace('.', ' ').toUpperCase(),
      academic_year: 'UG2',
      category_preferences: ['Performances', 'Clubs', 'Competitions', 'Social'],
      academic_timetable: DEFAULT_TIMETABLE_SAMPLE,
      saved_events: ['evt-3'],
      going_events: ['evt-1'],
      favourite_categories: ['Performances', 'Competitions'],
      created_at: new Date().toISOString(),
    };

    saveUserToStorage(newUser);
    if (isSupabaseConfigured()) {
      supabase.from('profiles').upsert([newUser]).then();
    }
    closeAuthModal();
    openOnboarding();
    return { success: true };
  };

  const logout = () => {
    saveUserToStorage(null);
    setCurrentTab('home');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    saveUserToStorage(nextUser);

    if (isSupabaseConfigured()) {
      supabase.from('profiles').upsert([nextUser]).then();
    }
  };

  const toggleSaveEvent = (eventId: string) => {
    if (!user) {
      openAuthModal('Sign in with your FLAME email to save this event and build your plan.');
      return;
    }

    const currentSaved = user.saved_events || [];
    const isAlreadySaved = currentSaved.includes(eventId);
    const updatedSaved = isAlreadySaved
      ? currentSaved.filter((id) => id !== eventId)
      : [...currentSaved, eventId];

    updateProfile({ saved_events: updatedSaved });
  };

  // Clash check helper
  const checkForScheduleClash = (event: EventItem): { hasClash: boolean; conflictTitle: string; conflictTime: string } => {
    if (!user) return { hasClash: false, conflictTitle: '', conflictTime: '' };

    // Parse event day of week
    const eventDate = new Date(event.date);
    const dayNames: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    const eventDay = dayNames[eventDate.getDay()];

    // 1. Check clash against academic timetable classes
    const eventStart = event.time_start || event.time_start_end.split('-')[0]?.trim();
    const eventEnd = event.time_end || event.time_start_end.split('-')[1]?.trim();

    if (eventStart && eventEnd) {
      for (const scheduledClass of user.academic_timetable || []) {
        if (scheduledClass.day === eventDay) {
          // Compare time overlap (e.g. "14:15" vs "15:00")
          if (
            (eventStart >= scheduledClass.timeStart && eventStart < scheduledClass.timeEnd) ||
            (eventEnd > scheduledClass.timeStart && eventEnd <= scheduledClass.timeEnd) ||
            (eventStart <= scheduledClass.timeStart && eventEnd >= scheduledClass.timeEnd)
          ) {
            return {
              hasClash: true,
              conflictTitle: scheduledClass.courseName,
              conflictTime: `${scheduledClass.day} ${scheduledClass.timeStart} - ${scheduledClass.timeEnd}`,
            };
          }
        }
      }
    }

    // 2. Check clash against other going events on the same date
    for (const goingId of user.going_events || []) {
      if (goingId === event.id) continue;
      const otherEvt = events.find((e) => e.id === goingId);
      if (otherEvt && otherEvt.date === event.date) {
        const otherStart = otherEvt.time_start || otherEvt.time_start_end.split('-')[0]?.trim();
        const otherEnd = otherEvt.time_end || otherEvt.time_start_end.split('-')[1]?.trim();
        if (
          otherStart &&
          otherEnd &&
          eventStart &&
          eventEnd &&
          ((eventStart >= otherStart && eventStart < otherEnd) ||
            (eventEnd > otherStart && eventEnd <= otherEnd))
        ) {
          return {
            hasClash: true,
            conflictTitle: otherEvt.event_name,
            conflictTime: `${otherEvt.date} ${otherEvt.time_start_end}`,
          };
        }
      }
    }

    return { hasClash: false, conflictTitle: '', conflictTime: '' };
  };

  const toggleGoingEvent = (eventId: string, force = false) => {
    if (!user) {
      openAuthModal('Sign in with your FLAME email to save this event and build your plan.');
      return;
    }

    const currentGoing = user.going_events || [];
    const isAlreadyGoing = currentGoing.includes(eventId);

    if (isAlreadyGoing) {
      // Remove
      updateProfile({ going_events: currentGoing.filter((id) => id !== eventId) });
      return;
    }

    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    // Clash detection check if not forcing
    if (!force) {
      const clash = checkForScheduleClash(targetEvent);
      if (clash.hasClash) {
        setClashInfo({
          event: targetEvent,
          conflictTitle: clash.conflictTitle,
          conflictTime: clash.conflictTime,
        });
        return;
      }
    }

    // Add to going
    const nextGoing = [...currentGoing, eventId];
    updateProfile({ going_events: nextGoing });

    // Crucial UX constraint from read.md line 130:
    // If registration_link exists, prompt user with external link to complete their actual registration!
    if (targetEvent.registration_link) {
      setExternalRegEvent(targetEvent);
    }
  };

  const resolveClash = (proceed: boolean) => {
    if (proceed && clashInfo) {
      toggleGoingEvent(clashInfo.event.id, true);
    }
    setClashInfo(null);
  };

  const toggleFavouriteCategory = (category: EventCategory) => {
    if (!user) {
      openAuthModal('Sign in with your FLAME email to save favourite categories.');
      return;
    }

    const currentFavs = user.favourite_categories || [];
    const isFav = currentFavs.includes(category);
    const updatedFavs = isFav
      ? currentFavs.filter((c) => c !== category)
      : [...currentFavs, category];

    updateProfile({ favourite_categories: updatedFavs });
  };

  const createEvent = (eventData: Omit<EventItem, 'id' | 'created_at'>) => {
    const newId = `evt-${Date.now()}`;
    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      created_at: new Date().toISOString(),
      submitted_by: user?.flame_email || 'guest@flame.edu.in',
    };
    const updated = [newEvent, ...events];
    saveEventsToStorage(updated);

    if (isSupabaseConfigured()) {
      supabase.from('events').insert([newEvent]).then();
    }
  };

  const updateEvent = (eventId: string, eventData: Partial<EventItem>) => {
    const updated = events.map((e) => (e.id === eventId ? { ...e, ...eventData } : e));
    saveEventsToStorage(updated);

    if (isSupabaseConfigured()) {
      supabase.from('events').update(eventData).eq('id', eventId).then();
    }
  };

  const deleteEvent = (eventId: string) => {
    const updated = events.filter((e) => e.id !== eventId);
    saveEventsToStorage(updated);
    if (user) {
      updateProfile({
        saved_events: user.saved_events.filter((id) => id !== eventId),
        going_events: user.going_events.filter((id) => id !== eventId),
      });
    }

    if (isSupabaseConfigured()) {
      supabase.from('events').delete().eq('id', eventId).then();
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        events,
        savedEventIds: user?.saved_events || [],
        goingEventIds: user?.going_events || [],
        favouriteCategories: user?.favourite_categories || [],
        notifications,
        unreadNotificationsCount,
        currentTab,
        setCurrentTab,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,
        isCreateEventOpen,
        openCreateEvent,
        closeCreateEvent,
        selectedEventForDetail,
        openEventDetail,
        closeEventDetail,
        clashInfo,
        resolveClash,
        externalRegEvent,
        closeExternalRegModal,
        loginAsGuest,
        loginWithFlameEmail,
        sendVerificationCode,
        verifyOtpCode,
        logout,
        updateProfile,
        toggleSaveEvent,
        toggleGoingEvent,
        toggleFavouriteCategory,
        createEvent,
        updateEvent,
        deleteEvent,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
