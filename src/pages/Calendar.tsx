import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getWorkoutsByDateRange } from '../services/workouts';
import type { Workout } from '../types';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { hasWorkoutOnDay } from '../utils/helpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const user = useStore((s) => s.user);
  const [month, setMonth] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 }).getTime();
      const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 }).getTime();
      const data = await getWorkoutsByDateRange(user.uid, start, end);
      setWorkouts(data);
      setLoading(false);
    })();
  }, [user, month]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  const workoutDays = workouts.length;
  const totalInMonth = workouts.filter((w) =>
    isSameMonth(w.finishedAt || w.startedAt, month)
  ).length;

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Consistency</h1>

        <div className="grid-2 mb-4">
          <div className="card card-sm text-center">
            <div className="font-bold" style={{ fontSize: '1.5rem' }}>
              {user?.currentStreak || 0}
            </div>
            <div className="text-xs text-muted">Current streak</div>
          </div>
          <div className="card card-sm text-center">
            <div className="font-bold" style={{ fontSize: '1.5rem' }}>
              {user?.longestStreak || 0}
            </div>
            <div className="text-xs text-muted">Longest streak</div>
          </div>
          <div className="card card-sm text-center">
            <div className="font-bold" style={{ fontSize: '1.5rem' }}>
              {totalInMonth}
            </div>
            <div className="text-xs text-muted">This month</div>
          </div>
          <div className="card card-sm text-center">
            <div className="font-bold" style={{ fontSize: '1.5rem' }}>
              {user?.totalWorkouts || 0}
            </div>
            <div className="text-xs text-muted">Total days</div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
              className="btn btn-ghost btn-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontSize: '1rem' }}>{format(month, 'MMMM yyyy')}</h2>
            <button
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
              className="btn btn-ghost btn-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 4,
              marginBottom: 8,
            }}
          >
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => (
              <div key={d} className="text-xs text-muted text-center font-medium">
                {d}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {days.map((day) => {
                const has = hasWorkoutOnDay(workouts, day);
                const inMonth = isSameMonth(day, month);
                return (
                  <div
                    key={day.toISOString()}
                    className={`cal-day ${has ? 'has-workout' : ''} ${isToday(day) ? 'today' : ''}`}
                    style={{
                      opacity: inMonth ? 1 : 0.3,
                      fontSize: 13,
                    }}
                  >
                    {format(day, 'd')}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
