export type Theme = 'light' | 'dark' | 'system';

export type ProfileVisibility = 'private' | 'club' | 'public';

export interface SocialLinks {
  instagram?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  photoURL?: string | null;
  bio?: string;
  socialLinks?: SocialLinks;
  visibility: ProfileVisibility;
  clubId?: string | null;
  joinedAt: number;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  prCount: number;
  lastWorkoutAt?: number | null;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetMuscle: string;
  equipment: string;
  description?: string;
  isCustom?: boolean;
  createdBy?: string;
}

export type ExerciseCategory =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Glutes'
  | 'Core'
  | 'Cardio'
  | 'Full Body';

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  duration?: number; // seconds for cardio
  rpe?: number;
  isWarmup: boolean;
  completed: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId?: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
  order: number;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  exercises: WorkoutExercise[];
  startedAt: number;
  finishedAt?: number | null;
  duration?: number; // seconds
  notes?: string;
  templateId?: string;
  totalVolume: number;
  isDraft?: boolean;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  exercises: { name: string; sets: number; reps?: number; weight?: number }[];
  createdAt: number;
  updatedAt: number;
  isStarter?: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'workouts_month' | 'workouts_week' | 'streak' | 'exercise_improve' | 'custom';
  title: string;
  target: number;
  current: number;
  exerciseName?: string;
  startDate: number;
  endDate?: number;
  completed: boolean;
  createdAt: number;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseName: string;
  type: 'heaviest' | 'most_reps' | 'volume' | 'estimated_1rm';
  value: number;
  weight?: number;
  reps?: number;
  achievedAt: number;
  workoutId: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  joinCode: string;
  memberCount: number;
  workoutsThisMonth: number;
  createdAt: number;
  createdBy: string;
  adminIds: string[];
}

export interface ClubMember {
  userId: string;
  joinedAt: number;
  role: 'member' | 'admin';
  displayName: string;
  username: string;
  photoURL?: string;
}

export interface Challenge {
  id: string;
  clubId: string;
  title: string;
  description: string;
  type: 'workouts_count' | 'consistency' | 'weekly';
  target: number;
  startDate: number;
  endDate: number;
  participantCount: number;
  createdAt: number;
}

export interface Announcement {
  id: string;
  clubId: string;
  title: string;
  body: string;
  createdAt: number;
  createdBy: string;
}

export interface Equipment {
  id: string;
  clubId: string;
  name: string;
  equipmentType: string;
  targetMuscles: string[];
  qrCode: string;
  status: 'ok' | 'maintenance' | 'issue';
  notes?: string;
}

export interface UserSettings {
  theme: Theme;
  notifications: {
    workoutReminders: boolean;
    goalReminders: boolean;
    streakReminders: boolean;
    challengeUpdates: boolean;
    clubAnnouncements: boolean;
    newPR: boolean;
  };
  units: 'kg' | 'lbs';
  restTimerDefault: number;
}

export interface ActiveWorkoutState {
  workout: Workout | null;
  restTimer: {
    active: boolean;
    remaining: number;
    total: number;
  };
  workoutTimer: {
    startedAt: number | null;
    pausedAt: number | null;
    elapsed: number;
  };
}
