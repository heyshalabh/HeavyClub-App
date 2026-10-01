import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Dumbbell, Calendar, Target, ChevronRight, Play, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getRecentWorkouts, getWorkoutsByDateRange } from '../services/workouts';
import type { Workout, Goal } from '../types';
import { formatDate, formatDuration, getWeekDays, hasWorkoutOnDay, calcVolume } from '../utils/helpers';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default function Dashboard() {
  const { user } = useStore();
  const [recent, setRecent] = useState<Workout[]>([]);
  const [weekWorkouts, setWeekWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const [rec, week] = await Promise.all([
          getRecentWorkouts(user.uid, 3),
          getWorkoutsByDateRange(
            user.uid,
            startOfWeek(new Date(), { weekStartsOn: 1 }).getTime(),
            endOfWeek(new Date(), { weekStartsOn: 1 }).getTime()
          ),
        ]);
        setRecent(rec);
        setWeekWorkouts(week);

        const gq = query(
          collection(db, 'users', user.uid, 'goals'),
          where('completed', '==', false),
          limit(3)
        );
        const gSnap = await getDocs(gq);
        setGoals(gSnap.docs.map((d) => d.data() as Goal));
      } catch {
        // empty states handle this
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return null;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const weekDays = getWeekDays();

  return (
    <div className="page fade-in">
      <div className="container">
        {/* Greeting */}
        <div className="mb-6">
          <h1 style={{ fontSize: '1.5rem' }}>
            {greeting}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-secondary text-sm mt-1">Ready to train?</p>
        </div>

        {/* Quick Start */}
        <Link
          to="/workout"
          className="btn btn-primary btn-lg btn-block mb-6"
          style={{ fontSize: '1.0625rem' }}
        >
          <Play size={20} />
          Start Workout
        </Link>

        {/* Stats row */}
        <div className="grid-2 mb-4" style={{ gap: '0.75rem' }}>
          <div className="card card-sm">
            <div className="flex items-center gap-2 text-muted text-xs mb-1">
              <Flame size={14} /> Streak
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {user.currentStreak}
              <span className="text-muted text-sm font-medium"> days</span>
            </div>
          </div>
          <div className="card card-sm">
            <div className="flex items-center gap-2 text-muted text-xs mb-1">
              <Dumbbell size={14} /> Total
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {user.totalWorkouts}
              <span className="text-muted text-sm font-medium"> workouts</span>
            </div>
          </div>
          <div className="card card-sm">
            <div className="flex items-center gap-2 text-muted text-xs mb-1">
              <Calendar size={14} /> This week
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {weekWorkouts.length}
            </div>
          </div>
          <div className="card card-sm">
            <div className="flex items-center gap-2 text-muted text-xs mb-1">
              <Trophy size={14} /> PRs
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {user.prCount}
            </div>
          </div>
        </div>

        {/* Week activity */}
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 style={{ fontSize: '0.9375rem' }}>This week</h2>
            <Link to="/calendar" className="text-sm text-accent flex items-center gap-1">
              Calendar <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex justify-between gap-1">
            {weekDays.map((day) => {
              const has = hasWorkoutOnDay(weekWorkouts, day);
              const label = day.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
              return (
                <div key={day.toISOString()} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="text-xs text-muted mb-1">{label}</div>
                  <div
                    className={`cal-day ${has ? 'has-workout' : ''}`}
                    style={{ margin: '0 auto', width: 32, height: 32, fontSize: 12 }}
                  >
                    {has ? '✓' : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent workout */}
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 style={{ fontSize: '0.9375rem' }}>Recent</h2>
            <Link to="/history" className="text-sm text-accent flex items-center gap-1">
              History <ChevronRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="spinner" />
            </div>
          ) : recent.length === 0 ? (
            <p className="text-secondary text-sm text-center py-4">
              No workouts yet. Start your first one!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((w) => (
                <Link
                  key={w.id}
                  to={`/workout/${w.id}`}
                  className="flex justify-between items-center"
                  style={{
                    padding: '0.75rem',
                    borderRadius: 8,
                    background: 'var(--bg-hover)',
                  }}
                >
                  <div>
                    <div className="font-medium text-sm">{w.name || 'Workout'}</div>
                    <div className="text-muted text-xs">
                      {formatDate(w.finishedAt || w.startedAt)}
                      {w.duration ? ` · ${formatDuration(w.duration)}` : ''}
                    </div>
                  </div>
                  <div className="text-sm text-secondary">
                    {Math.round(w.totalVolume).toLocaleString()} kg
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Goals */}
        {goals.length > 0 && (
          <div className="card mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 style={{ fontSize: '0.9375rem' }}>Goals</h2>
              <Link to="/goals" className="text-sm text-accent flex items-center gap-1">
                All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {goals.map((g) => {
                const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{g.title}</span>
                      <span className="text-muted">
                        {g.current}/{g.target}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights */}
        {user.currentStreak >= 3 && (
          <div
            className="card card-sm"
            style={{
              background: 'var(--accent-muted)',
              border: 'none',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--accent)' }}>
              🔥 You&apos;re on a {user.currentStreak}-day streak. Keep it going!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
