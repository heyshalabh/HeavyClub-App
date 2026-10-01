import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserSettings, ActiveWorkoutState, Workout, Theme } from '../types';

interface AppState {
  // Auth
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthLoading: boolean;
  setAuthLoading: (v: boolean) => void;

  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  setResolvedTheme: (t: 'light' | 'dark') => void;

  // Settings
  settings: UserSettings;
  setSettings: (s: Partial<UserSettings>) => void;

  // Active workout (local draft protection)
  activeWorkout: ActiveWorkoutState;
  setActiveWorkout: (w: Partial<ActiveWorkoutState>) => void;
  clearActiveWorkout: () => void;
  saveDraft: (workout: Workout) => void;
  draftWorkout: Workout | null;

  // Offline
  isOnline: boolean;
  setOnline: (v: boolean) => void;

  // UI
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: {
    workoutReminders: true,
    goalReminders: true,
    streakReminders: true,
    challengeUpdates: true,
    clubAnnouncements: true,
    newPR: true,
  },
  units: 'kg',
  restTimerDefault: 90,
};

const defaultActive: ActiveWorkoutState = {
  workout: null,
  restTimer: { active: false, remaining: 0, total: 90 },
  workoutTimer: { startedAt: null, pausedAt: null, elapsed: 0 },
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      isAuthLoading: true,
      setAuthLoading: (v) => set({ isAuthLoading: v }),

      theme: 'system',
      setTheme: (t) => set({ theme: t }),
      resolvedTheme: 'dark',
      setResolvedTheme: (t) => set({ resolvedTheme: t }),

      settings: defaultSettings,
      setSettings: (s) => set({ settings: { ...get().settings, ...s } }),

      activeWorkout: defaultActive,
      setActiveWorkout: (w) =>
        set({ activeWorkout: { ...get().activeWorkout, ...w } }),
      clearActiveWorkout: () => set({ activeWorkout: defaultActive, draftWorkout: null }),
      draftWorkout: null,
      saveDraft: (workout) => set({ draftWorkout: workout }),

      isOnline: true,
      setOnline: (v) => set({ isOnline: v }),

      toasts: [],
      addToast: (message, type = 'info') => {
        const id = Date.now().toString();
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => get().removeToast(id), 3500);
      },
      removeToast: (id) =>
        set({ toasts: get().toasts.filter((t) => t.id !== id) }),
    }),
    {
      name: 'heavyclub-storage',
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
        draftWorkout: state.draftWorkout,
      }),
    }
  )
);
