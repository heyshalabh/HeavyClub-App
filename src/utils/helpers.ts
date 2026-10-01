import { format, formatDistanceToNow, isToday, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(ts: number): string {
  if (isToday(ts)) return 'Today';
  if (isYesterday(ts)) return 'Yesterday';
  return format(ts, 'MMM d, yyyy');
}

export function formatTime(ts: number): string {
  return format(ts, 'h:mm a');
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatRelative(ts: number): string {
  return formatDistanceToNow(ts, { addSuffix: true });
}

export function calcVolume(sets: { weight: number; reps: number; completed?: boolean }[]): number {
  return sets
    .filter(s => s.completed !== false)
    .reduce((sum, s) => sum + s.weight * s.reps, 0);
}

export function estimated1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  // Epley formula
  return Math.round(weight * (1 + reps / 30));
}

export function getWeekDays(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function hasWorkoutOnDay(workouts: { finishedAt?: number | null; startedAt: number }[], day: Date): boolean {
  return workouts.some(w => {
    const ts = w.finishedAt || w.startedAt;
    return isSameDay(ts, day);
  });
}

export function calcStreak(workoutDates: number[]): { current: number; longest: number } {
  if (workoutDates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(workoutDates.map(d => format(d, 'yyyy-MM-dd')))]
    .sort()
    .reverse();

  let current = 0;
  let longest = 0;
  let streak = 0;
  let prev: Date | null = null;

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

  for (const d of sorted) {
    const date = new Date(d);
    if (!prev) {
      streak = 1;
      if (d === today || d === yesterday) current = 1;
    } else {
      const diff = Math.round((prev.getTime() - date.getTime()) / 86400000);
      if (diff === 1) {
        streak++;
        if (d === today || d === yesterday || current > 0) current = streak;
      } else {
        longest = Math.max(longest, streak);
        streak = 1;
        if (d === today || d === yesterday) current = 1;
        else current = 0;
      }
    }
    prev = date;
  }
  longest = Math.max(longest, streak);
  return { current, longest };
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
